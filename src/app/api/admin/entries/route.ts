import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';
import { EntryStatus, EntryType } from '@/types';

const manualEntrySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  amount: z.number().min(100).max(36000), // $1 - $360 in cents
  assignedNumber: z.number().min(1).optional(),
});

export async function GET(request: NextRequest) {
  const authResult = await verifyAdminToken(request);
  if (!authResult.success) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const entries = await prisma.entry.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await verifyAdminToken(request);
  if (!authResult.success) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = manualEntrySchema.parse(body);

    // If number not specified, find next available
    let assignedNumber = data.assignedNumber;
    if (!assignedNumber) {
      const takenNumbers = await prisma.entry.findMany({
        where: {
          status: { in: [EntryStatus.PENDING, EntryStatus.CONFIRMED] },
        },
        select: { assignedNumber: true },
      });
      const taken = new Set(takenNumbers.map((e) => e.assignedNumber));

      for (let i = 1; i <= 360; i++) {
        if (!taken.has(i)) {
          assignedNumber = i;
          break;
        }
      }

      if (!assignedNumber) {
        const maxNumber = Math.max(...takenNumbers.map((e) => e.assignedNumber), 360);
        assignedNumber = maxNumber + 1;
      }
    }

    // Check if number is already taken
    const existing = await prisma.entry.findFirst({
      where: {
        assignedNumber,
        status: { in: [EntryStatus.PENDING, EntryStatus.CONFIRMED] },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Entry number ${assignedNumber} is already taken` },
        { status: 400 }
      );
    }

    const entry = await prisma.entry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        assignedNumber,
        amountCharged: data.amount,
        entryType: EntryType.MANUAL,
        status: EntryStatus.CONFIRMED,
      },
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }
    console.error('Error creating manual entry:', error);
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    );
  }
}
