'use client';

import { useEffect, useState } from 'react';
import { Gift, Banknote, Loader2 } from 'lucide-react';

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
    <div className="card overflow-hidden">
      {/* Header */}
      <div
        className="bg-gradient-fc -mx-6 -mt-6 px-6 py-8 text-center text-white mb-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Grand Prize</h2>
        <p className="text-white/80">
          {info?.campaignName || 'Chance Raffle'}
        </p>
      </div>

      {/* Prize Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(54, 187, 174, 0.2)' }}
          >
            <Gift className="w-6 h-6" style={{ color: 'var(--fc-teal)' }} />
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Prize
            </p>
            <p className="font-semibold" style={{ color: 'var(--fc-navy)' }}>
              {info?.prizeDescription || 'Luxury Watch'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(27, 54, 93, 0.1)' }}
          >
            <Banknote className="w-6 h-6" style={{ color: 'var(--fc-navy)' }} />
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Cash-Out Option
            </p>
            <p className="font-semibold" style={{ color: 'var(--fc-navy)' }}>
              {cashValueFormatted}
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="mt-6 text-center">
        <a
          href="#enter"
          className="btn btn-primary w-full text-lg py-4"
        >
          Enter to Win
        </a>
      </div>
    </div>
  );
}
