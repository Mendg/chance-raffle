'use client';

import { useEffect, useState } from 'react';
import { Ticket, Clock, Loader2, Zap, TrendingUp } from 'lucide-react';

interface RaffleStats {
  totalEntries: number;
  primaryRemaining: number;
  isPrimarySoldOut: boolean;
  isOverflowActive: boolean;
  overflowTimeRemaining: number | null;
  recentEntries?: { name: string; number: number; timestamp: string }[];
  lowestAvailable?: number[];
}

export default function EntryCounter() {
  const [stats, setStats] = useState<RaffleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [overflowCountdown, setOverflowCountdown] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!stats?.overflowTimeRemaining) {
      setOverflowCountdown(null);
      return;
    }

    let remaining = stats.overflowTimeRemaining;
    const updateCountdown = () => {
      if (remaining <= 0) {
        setOverflowCountdown(null);
        fetchStats();
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setOverflowCountdown(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
      remaining -= 1000;
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [stats?.overflowTimeRemaining]);

  async function fetchStats() {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--fc-teal)' }} />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const percentTaken = ((360 - stats.primaryRemaining) / 360) * 100;

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'var(--fc-teal)', opacity: 0.1 }}
        >
          <Ticket className="w-6 h-6" style={{ color: 'var(--fc-teal)' }} />
        </div>
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--fc-navy)' }}>
            Entries Remaining
          </h3>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {stats.isPrimarySoldOut ? 'Overflow period active' : 'Primary entries available'}
          </p>
        </div>
      </div>

      {!stats.isPrimarySoldOut ? (
        <>
          <div className="text-center mb-4">
            <span
              className="text-5xl font-bold"
              style={{ color: 'var(--fc-teal)' }}
            >
              {stats.primaryRemaining}
            </span>
            <span
              className="text-2xl font-medium ml-2"
              style={{ color: 'var(--fc-navy)' }}
            >
              of 360
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 ease-out rounded-full"
              style={{
                width: `${percentTaken}%`,
                background: 'linear-gradient(90deg, var(--fc-teal) 0%, var(--fc-navy) 100%)',
              }}
            />
          </div>
          <p
            className="text-center text-sm mt-2"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {Math.round(percentTaken)}% sold
          </p>

          {stats.primaryRemaining <= 50 && stats.primaryRemaining > 0 && (
            <div
              className="mt-4 p-3 rounded-lg text-center text-sm font-medium animate-pulse-slow"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
            >
              Only {stats.primaryRemaining} entries left! Don&apos;t miss out!
            </div>
          )}

          {/* Lowest Available Numbers Teaser */}
          {stats.lowestAvailable && stats.lowestAvailable.length > 0 && (
            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(54, 187, 174, 0.1)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4" style={{ color: 'var(--fc-teal)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--fc-navy)' }}>
                  Lucky low numbers still available:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {stats.lowestAvailable.slice(0, 5).map((num) => (
                  <span
                    key={num}
                    className="px-3 py-1 rounded-full text-sm font-bold"
                    style={{ backgroundColor: 'var(--fc-teal)', color: 'white' }}
                  >
                    #{num}
                  </span>
                ))}
                {stats.lowestAvailable.length > 5 && (
                  <span className="px-3 py-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    +{stats.lowestAvailable.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {stats.recentEntries && stats.recentEntries.length > 0 && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4" style={{ color: 'var(--fc-navy)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--fc-navy)' }}>
                  Live Activity
                </span>
              </div>
              <div className="space-y-2">
                {stats.recentEntries.slice(0, 3).map((entry, i) => (
                  <div
                    key={i}
                    className="text-sm flex items-center gap-2 animate-fade-in"
                    style={{ color: 'var(--muted-foreground)', animationDelay: `${i * 100}ms` }}
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>
                      <strong style={{ color: 'var(--fc-navy)' }}>{entry.name}</strong> got #{entry.number} for ${entry.number}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Proof */}
          {stats.totalEntries > 0 && (
            <div className="mt-4 text-center">
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <span className="font-semibold" style={{ color: 'var(--fc-teal)' }}>
                  {stats.totalEntries} {stats.totalEntries === 1 ? 'person has' : 'people have'}
                </span>
                {' '}already entered
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center">
          {stats.isOverflowActive && overflowCountdown ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="w-5 h-5" style={{ color: 'var(--fc-teal)' }} />
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--fc-navy)' }}
                >
                  Overflow Period
                </span>
              </div>
              <div
                className="text-4xl font-mono font-bold mb-2"
                style={{ color: 'var(--fc-teal)' }}
              >
                {overflowCountdown}
              </div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Time remaining for additional entries
              </p>
            </>
          ) : (
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: 'var(--muted)' }}
            >
              <p className="font-medium" style={{ color: 'var(--fc-navy)' }}>
                All entries have been sold
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                Check back for the winner announcement!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
