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
          {/* Animated gradient overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 20% 50%, rgba(54, 187, 174, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(54, 187, 174, 0.3) 0%, transparent 50%)',
            }}
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Floating number decorations - more prominent */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[5%] left-[5%] text-[120px] font-bold text-white/[0.08] animate-float-slow">$1</div>
            <div className="absolute top-[15%] right-[10%] text-[100px] font-bold text-white/[0.06] animate-float-slower">$360</div>
            <div className="absolute bottom-[20%] left-[15%] text-[80px] font-bold text-white/[0.07] animate-float-slow">$7</div>
            <div className="absolute bottom-[10%] right-[20%] text-[90px] font-bold text-white/[0.05] animate-float-slower">$42</div>
            <div className="absolute top-[40%] left-[45%] text-[70px] font-bold text-white/[0.04] animate-float-slow">$127</div>
            <div className="absolute top-[60%] right-[5%] text-[60px] font-bold text-white/[0.06] animate-float-slower">$18</div>
          </div>

          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-teal-400/20 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl animate-pulse-slow" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm font-medium mb-6">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Live Raffle • Limited to 360 Entries
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  Win $10,000
                  <br />
                  <span style={{ color: 'var(--fc-teal-light)' }}>for as little as $1</span>
                </h1>

                <p className="text-xl text-white/90 mb-6 max-w-lg font-medium">
                  The raffle where your random number = your ticket price.
                </p>

                {/* Value prop boxes */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-bold mb-1">$1</div>
                    <div className="text-xs text-white/70">Minimum</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-bold mb-1">$180</div>
                    <div className="text-xs text-white/70">Average</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl sm:text-3xl font-bold mb-1">$360</div>
                    <div className="text-xs text-white/70">Maximum</div>
                  </div>
                </div>

                <p className="text-lg text-white/80 mb-8 max-w-lg">
                  Spin for a random number 1-360. That&apos;s your entry AND your price.
                  Get lucky with #12? Pay just $12. Every number has the same odds to win!
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
