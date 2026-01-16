import prisma from './prisma';
import { EntryType, EntryStatus } from '@/types';

export const TOTAL_PRIMARY_ENTRIES = 360;
export const OVERFLOW_DURATION_MS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

/**
 * Generate a random amount between $1 and $360 (in cents)
 */
export function generateRandomAmount(): number {
  // Random number between 1 and 360, then convert to cents
  const dollars = Math.floor(Math.random() * 360) + 1;
  return dollars * 100;
}

/**
 * Get the next available entry number
 * Uses a transaction to prevent race conditions
 */
export async function assignEntryNumber(): Promise<{
  number: number;
  entryType: EntryType;
  isOverflow: boolean;
}> {
  return await prisma.$transaction(async (tx) => {
    // Get all taken numbers
    const takenEntries = await tx.entry.findMany({
      where: {
        status: {
          in: [EntryStatus.PENDING, EntryStatus.CONFIRMED],
        },
      },
      select: {
        assignedNumber: true,
      },
    });

    const takenNumbers = new Set(takenEntries.map((e) => e.assignedNumber));

    // Find available primary numbers (1-360)
    const availablePrimaryNumbers: number[] = [];
    for (let i = 1; i <= TOTAL_PRIMARY_ENTRIES; i++) {
      if (!takenNumbers.has(i)) {
        availablePrimaryNumbers.push(i);
      }
    }

    // If primary numbers are available, pick one randomly
    if (availablePrimaryNumbers.length > 0) {
      const randomIndex = Math.floor(Math.random() * availablePrimaryNumbers.length);
      return {
        number: availablePrimaryNumbers[randomIndex],
        entryType: EntryType.PRIMARY,
        isOverflow: false,
      };
    }

    // Check if overflow is allowed
    const settings = await tx.settings.findFirst();
    if (!settings?.overflowEnabled) {
      throw new Error('All primary entries are taken and overflow is not enabled');
    }

    // Check if we're still in the overflow window
    if (settings.overflowStartTime) {
      const overflowEndTime = new Date(
        settings.overflowStartTime.getTime() + settings.overflowDuration * 60 * 1000
      );
      if (new Date() > overflowEndTime) {
        throw new Error('Overflow period has ended');
      }
    }

    // Get the highest overflow number
    const highestOverflow = await tx.entry.findFirst({
      where: {
        entryType: EntryType.OVERFLOW,
      },
      orderBy: {
        assignedNumber: 'desc',
      },
    });

    const nextOverflowNumber = highestOverflow
      ? highestOverflow.assignedNumber + 1
      : TOTAL_PRIMARY_ENTRIES + 1;

    return {
      number: nextOverflowNumber,
      entryType: EntryType.OVERFLOW,
      isOverflow: true,
    };
  });
}

/**
 * Get raffle statistics
 */
export async function getRaffleStats() {
  const [totalEntries, settings] = await Promise.all([
    prisma.entry.count({
      where: {
        status: {
          in: [EntryStatus.PENDING, EntryStatus.CONFIRMED],
        },
      },
    }),
    prisma.settings.findFirst(),
  ]);

  const primaryEntriesCount = await prisma.entry.count({
    where: {
      entryType: EntryType.PRIMARY,
      status: {
        in: [EntryStatus.PENDING, EntryStatus.CONFIRMED],
      },
    },
  });

  const overflowEntriesCount = await prisma.entry.count({
    where: {
      entryType: EntryType.OVERFLOW,
      status: {
        in: [EntryStatus.PENDING, EntryStatus.CONFIRMED],
      },
    },
  });

  const primaryRemaining = TOTAL_PRIMARY_ENTRIES - primaryEntriesCount;
  const isPrimarySoldOut = primaryRemaining <= 0;

  let overflowTimeRemaining: number | null = null;
  let isOverflowActive = false;

  if (settings?.overflowEnabled && settings.overflowStartTime) {
    const overflowEndTime = new Date(
      settings.overflowStartTime.getTime() + settings.overflowDuration * 60 * 1000
    );
    const now = new Date();
    if (now < overflowEndTime) {
      isOverflowActive = true;
      overflowTimeRemaining = overflowEndTime.getTime() - now.getTime();
    }
  }

  return {
    totalEntries,
    primaryEntriesCount,
    overflowEntriesCount,
    primaryRemaining,
    isPrimarySoldOut,
    isOverflowActive,
    overflowTimeRemaining,
    settings,
  };
}

/**
 * Enable overflow period
 */
export async function enableOverflow() {
  return await prisma.settings.upsert({
    where: { id: 'default' },
    update: {
      overflowEnabled: true,
      overflowStartTime: new Date(),
    },
    create: {
      id: 'default',
      overflowEnabled: true,
      overflowStartTime: new Date(),
    },
  });
}

/**
 * Draw a random winner from confirmed entries
 */
export async function drawWinner() {
  const entries = await prisma.entry.findMany({
    where: {
      status: EntryStatus.CONFIRMED,
    },
  });

  if (entries.length === 0) {
    throw new Error('No confirmed entries to draw from');
  }

  const randomIndex = Math.floor(Math.random() * entries.length);
  const winner = entries[randomIndex];

  // Update settings with winner
  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {
      winnerId: winner.id,
      winnerDrawnAt: new Date(),
    },
    create: {
      id: 'default',
      winnerId: winner.id,
      winnerDrawnAt: new Date(),
    },
  });

  return winner;
}
