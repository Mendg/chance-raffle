import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HowItWorks from '@/components/HowItWorks';
import Rules from '@/components/Rules';
import EntryCounter from '@/components/EntryCounter';
import PrizeDisplay from '@/components/PrizeDisplay';
import EntryForm from '@/components/EntryForm';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-fc text-white py-16 sm:py-24 relative overflow-hidden">
          {/* Floating number decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 text-8xl font-bold text-white/5 animate-pulse-slow">$1</div>
            <div className="absolute top-20 right-20 text-7xl font-bold text-white/5 animate-pulse-slow">$360</div>
            <div className="absolute bottom-20 left-1/4 text-6xl font-bold text-white/5 animate-pulse-slow">$42</div>
            <div className="absolute bottom-10 right-1/3 text-5xl font-bold text-white/5 animate-pulse-slow">$127</div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm font-medium mb-6">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Live Raffle • Limited to 360 Entries
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Your Number =
                  <br />
                  <span style={{ color: 'var(--fc-teal-light)' }}>Your Price</span>
                </h1>

                {/* Value prop boxes */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold mb-1">$1-$360</div>
                    <div className="text-sm text-white/70">Random ticket price</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold mb-1">1 in 360</div>
                    <div className="text-sm text-white/70">Odds of winning</div>
                  </div>
                </div>

                <p className="text-lg text-white/80 mb-8 max-w-lg">
                  The only raffle where luck decides <em>both</em> your entry number
                  AND your ticket price. Get #7? Pay just $7. Get #350? Pay $350.
                  Every number has the same chance to win!
                </p>

                <div className="flex flex-wrap gap-4">
                  <a href="#enter" className="btn bg-white text-fc-navy hover:bg-white/90 text-lg px-8 py-4 font-bold" style={{ color: 'var(--fc-navy)' }}>
                    Try Your Luck →
                  </a>
                  <a
                    href="#how-it-works"
                    className="btn bg-white/10 text-white hover:bg-white/20 text-lg px-8 py-4"
                  >
                    See How It Works
                  </a>
                </div>
              </div>

              <div className="lg:pl-8">
                <EntryCounter />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <HowItWorks />

        {/* Entry Section */}
        <section id="enter" className="py-16 sm:py-24" style={{ backgroundColor: 'var(--muted)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div
                className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-4"
                style={{ backgroundColor: 'rgba(27, 54, 93, 0.1)', color: 'var(--fc-navy)' }}
              >
                🎰 Ready to Spin?
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold mb-4"
                style={{ color: 'var(--fc-navy)' }}
              >
                Take Your Chance Now
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto mb-4"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Enter your details, authorize $360, and watch the magic happen.
                Your number spins, lands, and that&apos;s what you pay!
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Secure Stripe checkout
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Instant confirmation
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  100% to charity
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <PrizeDisplay />
              <EntryForm />
            </div>
          </div>
        </section>

        {/* Rules */}
        <Rules />

        {/* FAQ Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-3xl sm:text-4xl font-bold text-center mb-12"
              style={{ color: 'var(--fc-navy)' }}
            >
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="card">
                <h3 className="font-semibold mb-2" style={{ color: 'var(--fc-navy)' }}>
                  What if I get a high number like 350?
                </h3>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  That means you pay $350 for your entry, but you also get the
                  exclusive entry #350. Every number has an equal chance of
                  winning, regardless of the amount paid!
                </p>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-2" style={{ color: 'var(--fc-navy)' }}>
                  Can I choose my number?
                </h3>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  No, numbers are randomly assigned to keep the raffle fair.
                  This is what makes it a &quot;chance&quot; raffle - you take a chance
                  on both your entry number and your ticket price!
                </p>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-2" style={{ color: 'var(--fc-navy)' }}>
                  What is the overflow period?
                </h3>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  Once all 360 primary entries are sold, we open a 3-hour window
                  where additional entries can be purchased. These entries get
                  numbers starting at 361 and still pay random amounts ($1-$360).
                </p>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-2" style={{ color: 'var(--fc-navy)' }}>
                  When will the winner be announced?
                </h3>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  The winner will be drawn and announced after all entries are
                  sold or the overflow period ends. The winner will be notified
                  by email and phone.
                </p>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-2" style={{ color: 'var(--fc-navy)' }}>
                  Can I get a refund?
                </h3>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  Once your entry is confirmed and payment is captured, no refunds
                  are available. Your contribution goes directly to supporting
                  Friendship Circle&apos;s programs for individuals with special needs.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
