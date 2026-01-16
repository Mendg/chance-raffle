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
        <section className="bg-gradient-fc text-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Take a Chance,
                  <br />
                  <span style={{ color: 'var(--fc-teal-light)' }}>Make a Difference</span>
                </h1>
                <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-lg">
                  Enter our unique raffle where your random entry number becomes
                  your ticket price. Pay anywhere from $1 to $360 for a chance
                  to win big!
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="#enter" className="btn btn-primary text-lg px-8 py-4">
                    Enter Now
                  </a>
                  <a
                    href="#how-it-works"
                    className="btn bg-white/10 text-white hover:bg-white/20 text-lg px-8 py-4"
                  >
                    Learn More
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
              <h2
                className="text-3xl sm:text-4xl font-bold mb-4"
                style={{ color: 'var(--fc-navy)' }}
              >
                Ready to Enter?
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Fill out the form below and authorize your entry. Remember,
                you&apos;ll only be charged your randomly assigned amount!
              </p>
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
                  our charitable mission.
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
