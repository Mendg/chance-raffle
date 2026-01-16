import { NextResponse } from 'next/server';
import { getRaffleStats } from '@/lib/raffle';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getRaffleStats();

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
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
