'use client';

import { useEffect, useState } from 'react';
import { Gift, Banknote, Loader2, Star, Shield, Heart } from 'lucide-react';

interface RaffleInfo {
  campaignName: string;
  prizeDescription: string;
  cashValue: number;
}

export default function PrizeDisplay() {
  const [info, setInfo] = useState<RaffleInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInfo() {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setInfo({
            campaignName: data.campaignName,
            prizeDescription: data.prizeDescription,
            cashValue: data.cashValue,
          });
        }
      } catch (error) {
        console.error('Failed to fetch raffle info:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchInfo();
  }, []);

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--fc-teal)' }} />
      </div>
    );
  }

  const cashValueFormatted = info?.cashValue
    ? (info.cashValue / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      })
    : '$10,000';

  return (
    <div className="card overflow-hidden relative">
      {/* Decorative corner */}
      <div
        className="absolute top-0 right-0 w-32 h-32 -translate-y-1/2 translate-x-1/2 rounded-full"
        style={{ backgroundColor: 'rgba(54, 187, 174, 0.1)' }}
      />

      {/* Header */}
      <div
        className="bg-gradient-fc -mx-6 -mt-6 px-6 py-8 text-center text-white mb-6 relative overflow-hidden"
      >
        {/* Sparkle decorations */}
        <Star className="absolute top-4 left-4 w-4 h-4 text-white/30 animate-pulse" />
        <Star className="absolute bottom-4 right-8 w-3 h-3 text-white/20 animate-pulse" />
        <Star className="absolute top-8 right-4 w-5 h-5 text-white/25 animate-pulse" />

        <div className="relative">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            🏆 GRAND PRIZE
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">{cashValueFormatted}</h2>
          <p className="text-white/80 text-sm">
            {info?.prizeDescription || 'Cash or Prize Equivalent'}
          </p>
        </div>
      </div>

      {/* Prize Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed" style={{ borderColor: 'var(--border)' }}>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(54, 187, 174, 0.15)' }}
          >
            <Gift className="w-6 h-6" style={{ color: 'var(--fc-teal)' }} />
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--fc-navy)' }}>
              Winner&apos;s Choice
            </p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Take the prize or cash equivalent
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed" style={{ borderColor: 'var(--border)' }}>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(27, 54, 93, 0.1)' }}
          >
            <Shield className="w-6 h-6" style={{ color: 'var(--fc-navy)' }} />
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--fc-navy)' }}>
              Fair & Transparent
            </p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Every number has equal winning odds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed" style={{ borderColor: 'var(--border)' }}>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
          >
            <Heart className="w-6 h-6" style={{ color: '#ef4444' }} />
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--fc-navy)' }}>
              100% for Good
            </p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Supports Friendship Circle programs
            </p>
          </div>
        </div>
      </div>

      {/* Odds callout */}
      <div
        className="mt-6 p-4 rounded-xl text-center"
        style={{ backgroundColor: 'rgba(54, 187, 174, 0.1)' }}
      >
        <p className="text-sm font-medium" style={{ color: 'var(--fc-navy)' }}>
          Your odds of winning:
        </p>
        <p className="text-2xl font-bold" style={{ color: 'var(--fc-teal)' }}>
          1 in 360
        </p>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Better than most lotteries!
        </p>
      </div>
    </div>
  );
}
