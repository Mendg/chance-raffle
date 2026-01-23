import { NextResponse } from 'next/server';
import { getRaffleStats, TOTAL_PRIMARY_ENTRIES } from '@/lib/raffle';
import prisma from '@/lib/prisma';
import { EntryStatus } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getRaffleStats();

    // Get recent entries (last 5, anonymized first names only)
    const recentEntries = await prisma.entry.findMany({
      where: {
        status: EntryStatus.CONFIRMED,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      select: {
        name: true,
        assignedNumber: true,
        createdAt: true,
      },
    });

    // Get taken numbers to find lowest available
    const takenNumbers = await prisma.entry.findMany({
      where: {
        status: {
          in: [EntryStatus.PENDING, EntryStatus.CONFIRMED],
        },
      },
      select: {
        assignedNumber: true,
      },
    });

    const takenSet = new Set(takenNumbers.map((e) => e.assignedNumber));
    const lowestAvailable: number[] = [];
    for (let i = 1; i <= TOTAL_PRIMARY_ENTRIES && lowestAvailable.length < 10; i++) {
      if (!takenSet.has(i)) {
        lowestAvailable.push(i);
      }
    }

    return NextResponse.json({
      totalEntries: stats.totalEntries,
      primaryEntriesCount: stats.primaryEntriesCount,
      overflowEntriesCount: stats.overflowEntriesCount,
      primaryRemaining: stats.primaryRemaining,
      isPrimarySoldOut: stats.isPrimarySoldOut,
      isOverflowActive: stats.isOverflowActive,
      overflowTimeRemaining: stats.overflowTimeRemaining,
      campaignName: stats.settings?.campaignName || 'Chance Raffle',
      prizeDescription: stats.settings?.prizeDescription || 'Grand Prize',
      cashValue: stats.settings?.cashValue || 0,
      isActive: stats.settings?.isActive ?? true,
      winnerId: stats.settings?.winnerId,
      // Gamification data
      recentEntries: recentEntries.map((e) => ({
        name: e.name.split(' ')[0], // First name only for privacy
        number: e.assignedNumber,
        timestamp: e.createdAt.toISOString(),
      })),
      lowestAvailable,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
