'use client';

import { CreditCard, Shuffle, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const steps = [
  {
    icon: CreditCard,
    title: 'Authorize $360',
    subtitle: 'Your card is held securely',
    description:
      'We place a temporary $360 hold on your card. This is NOT a charge - it\'s just an authorization that ensures you can cover any possible amount.',
    highlight: 'You won\'t be charged $360',
  },
  {
    icon: Shuffle,
    title: 'Spin Your Number',
    subtitle: 'Watch the magic happen',
    description:
      'Our system randomly assigns you a number from 1-360. That number becomes BOTH your raffle entry AND your ticket price. It\'s a two-for-one surprise!',
    highlight: 'Number = Price',
  },
  {
    icon: Trophy,
    title: 'Win the Prize',
    subtitle: 'Every number has equal odds',
    description:
      'One lucky number wins! Whether you paid $3 or $300, your odds are exactly the same. Plus, 100% of proceeds support Friendship Circle.',
    highlight: 'Fair odds for all',
  },
];

function AnimatedExample() {
  const [currentNumber, setCurrentNumber] = useState(127);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpinning(true);
      let spins = 0;
      const spinInterval = setInterval(() => {
        setCurrentNumber(Math.floor(Math.random() * 360) + 1);
        spins++;
        if (spins > 15) {
          clearInterval(spinInterval);
          const finalNumbers = [7, 42, 127, 183, 256, 12, 89, 315];
          setCurrentNumber(finalNumbers[Math.floor(Math.random() * finalNumbers.length)]);
          setIsSpinning(false);
        }
      }, 80);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-fc rounded-2xl p-8 text-white text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="w-5 h-5" />
        <span className="text-sm font-medium uppercase tracking-wider">Live Example</span>
        <Sparkles className="w-5 h-5" />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
        <div className="text-center">
          <div className="text-sm text-white/70 mb-1">You authorize</div>
          <div className="text-2xl font-bold">$360</div>
        </div>

        <ArrowRight className="w-6 h-6 text-white/50 rotate-90 sm:rotate-0" />

        <div className="text-center">
          <div className="text-sm text-white/70 mb-1">You get number</div>
          <div
            className={`text-4xl font-bold tabular-nums ${isSpinning ? 'blur-[2px]' : ''}`}
            style={{ color: 'var(--fc-teal-light)' }}
          >
            #{currentNumber}
          </div>
        </div>

        <ArrowRight className="w-6 h-6 text-white/50 rotate-90 sm:rotate-0" />

        <div className="text-center">
          <div className="text-sm text-white/70 mb-1">You only pay</div>
          <div
            className={`text-4xl font-bold tabular-nums ${isSpinning ? 'blur-[2px]' : ''}`}
            style={{ color: 'var(--fc-teal-light)' }}
          >
            ${currentNumber}
          </div>
        </div>
      </div>

      <p className="text-sm text-white/60 mt-6">
        Watch the number spin! This is exactly what happens when you enter.
      </p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div
            className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-4"
            style={{ backgroundColor: 'rgba(54, 187, 174, 0.1)', color: 'var(--fc-teal)' }}
          >
            Simple & Transparent
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: 'var(--fc-navy)' }}
          >
            How the Spin Raffle Works
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--muted-foreground)' }}
          >
            It&apos;s like a slot machine meets a charity raffle - simple, exciting, and 100% fair
          </p>
        </div>

        {/* Animated Example - Now at the top for immediate understanding */}
        <div className="mb-16">
          <AnimatedExample />
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-12 left-1/2 w-full h-0.5"
                  style={{ backgroundColor: 'var(--border)' }}
                />
              )}

              <div className="card relative bg-white h-full">
                {/* Step number */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg"
                  style={{ backgroundColor: 'var(--fc-navy)' }}
                >
                  {index + 1}
                </div>

                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-4"
                  style={{ backgroundColor: 'rgba(27, 54, 93, 0.1)' }}
                >
                  <step.icon
                    className="w-8 h-8"
                    style={{ color: 'var(--fc-navy)' }}
                  />
                </div>

                <div className="text-center">
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{ color: 'var(--fc-navy)' }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm font-medium mb-3"
                    style={{ color: 'var(--fc-teal)' }}
                  >
                    {step.subtitle}
                  </p>
                  <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
                    {step.description}
                  </p>

                  {/* Highlight badge */}
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: 'rgba(54, 187, 174, 0.15)', color: 'var(--fc-teal)' }}
                  >
                    {step.highlight}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ-style clarifications */}
        <div className="mt-16 grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
            <h4 className="font-bold mb-2" style={{ color: 'var(--fc-navy)' }}>
              🤔 What if I get a high number like #350?
            </h4>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              You&apos;d pay $350, but your odds of winning are identical to someone who got #7.
              That&apos;s the &quot;chance&quot; in Chance Raffle - and it&apos;s all for a great cause!
            </p>
          </div>
          <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
            <h4 className="font-bold mb-2" style={{ color: 'var(--fc-navy)' }}>
              💳 Is my card really charged $360?
            </h4>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              No! We only <em>authorize</em> $360 (like a hotel hold). You&apos;re only charged
              your actual number. The rest is released back to your card instantly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
