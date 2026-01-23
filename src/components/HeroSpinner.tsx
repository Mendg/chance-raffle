'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function HeroSpinner() {
  const [currentNumber, setCurrentNumber] = useState(1);
  const [phase, setPhase] = useState<'spinning' | 'slowing' | 'landed'>('spinning');
  const [finalNumber, setFinalNumber] = useState(42);

  useEffect(() => {
    const luckyNumbers = [7, 12, 23, 42, 88, 127, 156, 203, 289, 314];
    let cycleTimeout: NodeJS.Timeout;

    const runCycle = () => {
      setPhase('spinning');
      let iterations = 0;
      let speed = 50;

      const spin = () => {
        iterations++;
        setCurrentNumber(Math.floor(Math.random() * 360) + 1);

        if (iterations < 20) {
          setTimeout(spin, speed);
        } else if (iterations < 30) {
          setPhase('slowing');
          speed += 40;
          setTimeout(spin, speed);
        } else {
          const newFinal = luckyNumbers[Math.floor(Math.random() * luckyNumbers.length)];
          setFinalNumber(newFinal);
          setCurrentNumber(newFinal);
          setPhase('landed');

          // Start next cycle after 3 seconds
          cycleTimeout = setTimeout(runCycle, 3000);
        }
      };

      spin();
    };

    runCycle();

    return () => {
      clearTimeout(cycleTimeout);
    };
  }, []);

  return (
    <div className="relative">
      {/* Main spinner display */}
      <div
        className={`
          relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20
          transition-all duration-500
          ${phase === 'landed' ? 'scale-105' : 'scale-100'}
        `}
        style={{
          boxShadow: phase === 'landed'
            ? '0 0 60px rgba(54, 187, 174, 0.4), 0 25px 50px rgba(0,0,0,0.3)'
            : '0 25px 50px rgba(0,0,0,0.2)'
        }}
      >
        {/* Decorative top label */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white rounded-full">
          <span className="text-xs font-bold" style={{ color: 'var(--fc-navy)' }}>
            {phase === 'landed' ? '🎉 YOU PAY' : '🎰 SPINNING...'}
          </span>
        </div>

        {/* Number display */}
        <div className="text-center py-4">
          <div
            className={`
              text-7xl sm:text-8xl font-bold tabular-nums transition-all duration-300
              ${phase === 'spinning' ? 'blur-[3px] text-white/80' : ''}
              ${phase === 'slowing' ? 'blur-[1px] text-white/90' : ''}
              ${phase === 'landed' ? 'text-white' : ''}
            `}
          >
            ${currentNumber}
          </div>

          {phase === 'landed' && (
            <div className="mt-2 flex items-center justify-center gap-2 animate-fade-in">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-white/80 text-sm">Entry #{finalNumber}</span>
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
          )}
        </div>

        {/* Animated border glow when landed */}
        {phase === 'landed' && (
          <div
            className="absolute inset-0 rounded-3xl animate-pulse"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(54, 187, 174, 0.3), transparent)',
              backgroundSize: '200% 100%',
            }}
          />
        )}
      </div>

      {/* Side decorations - sample numbers */}
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="space-y-2 opacity-40">
          {[283, 94, 167].map((num) => (
            <div
              key={num}
              className="text-right text-white/60 text-lg font-medium"
            >
              ${num}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="space-y-2 opacity-40">
          {[51, 219, 8].map((num) => (
            <div
              key={num}
              className="text-left text-white/60 text-lg font-medium"
            >
              ${num}
            </div>
          ))}
        </div>
      </div>

      {/* Caption */}
      <p className="text-center text-white/60 text-sm mt-4">
        Watch it spin! This is what happens when you enter.
      </p>
    </div>
  );
}
