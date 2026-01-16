import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent, MAX_AUTHORIZATION_AMOUNT } from '@/lib/stripe';
import { getRaffleStats } from '@/lib/raffle';

export async function POST(request: NextRequest) {
  try {
    // Check if raffle is still accepting entries
    const stats = await getRaffleStats();

    if (!stats.settings?.isActive) {
      return NextResponse.json(
        { error: 'Raffle is not currently active' },
        { status: 400 }
      );
    }

    if (stats.isPrimarySoldOut && !stats.isOverflowActive) {
      return NextResponse.json(
        { error: 'All entries have been sold' },
        { status: 400 }
      );
    }

    // Create a payment intent with manual capture
    const paymentIntent = await createPaymentIntent(MAX_AUTHORIZATION_AMOUNT, {
      raffleType: stats.isPrimarySoldOut ? 'overflow' : 'primary',
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
