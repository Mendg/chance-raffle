import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { drawWinner } from '@/lib/raffle';
import { sendWinnerNotification } from '@/lib/email';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const authResult = await verifyAdminToken(request);
  if (!authResult.success) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if winner already drawn
    const settings = await prisma.settings.findFirst();
    if (settings?.winnerId) {
      const existingWinner = await prisma.entry.findUnique({
        where: { id: settings.winnerId },
      });
      return NextResponse.json({
        success: true,
        winner: existingWinner,
        alreadyDrawn: true,
      });
    }

    const winner = await drawWinner();

    // Send winner notification email (non-blocking)
    sendWinnerNotification({
      name: winner.name,
      email: winner.email,
      assignedNumber: winner.assignedNumber,
      campaignName: settings?.campaignName || 'Chance Raffle',
      prizeDescription: settings?.prizeDescription || 'Grand Prize',
      cashValue: settings?.cashValue || 0,
    }).catch((err) => console.error('Failed to send winner email:', err));

    return NextResponse.json({
      success: true,
      winner,
      alreadyDrawn: false,
    });
  } catch (error) {
    console.error('Error drawing winner:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to draw winner' },
      { status: 500 }
    );
  }
}
