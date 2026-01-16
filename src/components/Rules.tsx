import { AlertCircle, Clock, Users, DollarSign } from 'lucide-react';

export default function Rules() {
  return (
    <section id="rules" className="py-16 sm:py-24 bg-gradient-fc text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Entry Terms</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Everything you need to know about how our raffle works
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Primary Entries */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">360 Primary Entries</h3>
                <p className="text-white/80">
                  The raffle consists of 360 unique entry numbers (1-360). Each
                  number can only be assigned once, ensuring fair odds for all
                  participants.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Random Pricing</h3>
                <p className="text-white/80">
                  Your entry cost equals your assigned number. Get #50, pay $50.
                  Get #350, pay $350. Every amount has an equal chance of winning!
                </p>
              </div>
            </div>
          </div>

          {/* Overflow Period */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">3-Hour Overflow</h3>
                <p className="text-white/80">
                  Once all 360 primary entries are sold, a 3-hour overflow period
                  begins. Additional entries (361+) can be purchased at random
                  amounts during this window.
                </p>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Important</h3>
                <p className="text-white/80">
                  Payment authorization is for $360 maximum. You will only be
                  charged your assigned amount. No refunds once entry is confirmed.
                  Winner may choose cash equivalent.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Halacha Note */}
        <div className="mt-8 p-4 bg-white/5 rounded-lg text-center text-sm text-white/60">
          <p>
            * The 3-hour overflow period is structured for halachic compliance with
            religious guidelines regarding charitable lotteries.
          </p>
        </div>
      </div>
    </section>
  );
}
