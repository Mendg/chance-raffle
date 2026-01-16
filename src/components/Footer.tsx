import { Heart, Shield, Lock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-fc text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Friendship Circle Raffle</span>
            </div>
            <p className="text-white/80 text-sm">
              Friendship Circle creates friendships between teen volunteers
              and individuals with special needs. Every entry supports our mission.
            </p>
          </div>

          {/* Trust Indicators */}
          <div>
            <h3 className="font-semibold mb-4">Trust & Security</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Shield className="w-4 h-4" />
                <span>501(c)(3) Nonprofit Organization</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Lock className="w-4 h-4" />
                <span>Secure Payment Processing</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Questions?</h3>
            <p className="text-white/80 text-sm mb-2">
              Contact our team for any inquiries about the raffle.
            </p>
            <a
              href="mailto:raffle@friendshipcircle.org"
              className="text-sm hover:underline"
              style={{ color: 'var(--fc-teal-light)' }}
            >
              raffle@friendshipcircle.org
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
          <p>&copy; {currentYear} Friendship Circle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
