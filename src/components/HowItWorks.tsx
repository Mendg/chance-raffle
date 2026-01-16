import { CreditCard, Shuffle, Trophy } from 'lucide-react';

const steps = [
  {
    icon: CreditCard,
    title: 'Prepay',
    description:
      'Authorize a payment of up to $360. Your card is securely held, but you will only be charged the random amount assigned.',
  },
  {
    icon: Shuffle,
    title: 'Take a Chance',
    description:
      'Get randomly assigned a number from 1-360. That number is also your charge amount in dollars. Pay $47? You get entry #47!',
  },
  {
    icon: Trophy,
    title: 'Win Big',
    description:
      'One lucky number wins the grand prize! Every dollar you spend goes directly to supporting our mission.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: 'var(--fc-navy)' }}
          >
            How It Works
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Three simple steps to enter our chance raffle and support a great cause
          </p>
        </div>

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

              <div className="card relative bg-white text-center">
                {/* Step number */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: 'var(--fc-teal)' }}
                >
                  {index + 1}
                </div>

                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 mt-4"
                  style={{ backgroundColor: 'rgba(54, 187, 174, 0.1)' }}
                >
                  <step.icon
                    className="w-8 h-8"
                    style={{ color: 'var(--fc-teal)' }}
                  />
                </div>

                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: 'var(--fc-navy)' }}
                >
                  {step.title}
                </h3>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Example illustration */}
        <div
          className="mt-12 p-6 rounded-2xl text-center"
          style={{ backgroundColor: 'var(--muted)' }}
        >
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--fc-navy)' }}>
            Example
          </p>
          <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
            You authorize $360 → Get assigned{' '}
            <span className="font-bold" style={{ color: 'var(--fc-teal)' }}>
              #127
            </span>{' '}
            → Only charged{' '}
            <span className="font-bold" style={{ color: 'var(--fc-teal)' }}>
              $127
            </span>{' '}
            → Win with number 127!
          </p>
        </div>
      </div>
    </section>
  );
}
