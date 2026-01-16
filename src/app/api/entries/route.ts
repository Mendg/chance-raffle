import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { capturePayment, cancelPayment } from '@/lib/stripe';
import { assignEntryNumber, getRaffleStats, enableOverflow, TOTAL_PRIMARY_ENTRIES } from '@/lib/raffle';
import { sendEntryConfirmation } from '@/lib/email';
import { EntryStatus } from '@/types';

const createEntrySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  paymentIntentId: z.string().min(1, 'Payment intent ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createEntrySchema.parse(body);

    // Assign a random entry number (handles race conditions)
    let assignment;
    try {
      assignment = await assignEntryNumber();
    } catch (error) {
      // If all entries are taken, cancel the payment authorization
      await cancelPayment(validatedData.paymentIntentId);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'No entries available' },
        { status: 400 }
      );
    }

    // Charge amount equals the entry number (entry #190 = $190)
    const amountToCharge = assignment.number * 100; // Convert to cents

    // Create the entry record first (pending status)
    const entry = await prisma.entry.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        assignedNumber: assignment.number,
        amountCharged: amountToCharge,
        paymentId: validatedData.paymentIntentId,
        entryType: assignment.entryType,
        status: EntryStatus.PENDING,
      },
    });

    try {
      // Capture the random amount from the authorized payment
      await capturePayment(validatedData.paymentIntentId, amountToCharge);

      // Update entry status to confirmed
      const confirmedEntry = await prisma.entry.update({
        where: { id: entry.id },
        data: { status: EntryStatus.CONFIRMED },
      });

      // Check if we just sold out primary entries and should enable overflow
      if (!assignment.isOverflow) {
        const stats = await getRaffleStats();
        if (stats.primaryRemaining === 0 && !stats.isOverflowActive) {
          await enableOverflow();
        }
      }

      // Send confirmation email (non-blocking)
      const settings = await prisma.settings.findFirst();
      sendEntryConfirmation({
        name: validatedData.name,
        email: validatedData.email,
        assignedNumber: assignment.number,
        amountCharged: amountToCharge,
        campaignName: settings?.campaignName || 'Chance Raffle',
        prizeDescription: settings?.prizeDescription || 'Grand Prize',
      }).catch((err) => console.error('Failed to send email:', err));

      return NextResponse.json({
        success: true,
        entry: confirmedEntry,
      });
    } catch (captureError) {
      // Payment capture failed - mark entry as failed
      await prisma.entry.update({
        where: { id: entry.id },
        data: { status: EntryStatus.FAILED },
      });

      console.error('Payment capture failed:', captureError);
      return NextResponse.json(
        { error: 'Payment capture failed. Please try again.' },
        { status: 400 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const entries = await prisma.entry.findMany({
      where: {
        status: {
          in: [EntryStatus.PENDING, EntryStatus.CONFIRMED],
        },
      },
      orderBy: {
        assignedNumber: 'asc',
      },
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
