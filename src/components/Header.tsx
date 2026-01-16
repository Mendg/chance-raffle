'use client';

import Link from 'next/link';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-fc rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ color: 'var(--fc-navy)' }}>
              Chance Raffle
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:opacity-80 transition"
              style={{ color: 'var(--fc-navy)' }}
            >
              How It Works
            </Link>
            <Link
              href="#rules"
              className="text-sm font-medium hover:opacity-80 transition"
              style={{ color: 'var(--fc-navy)' }}
            >
              Rules
            </Link>
            <Link href="#enter" className="btn btn-primary">
              Enter Now
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" style={{ color: 'var(--fc-navy)' }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: 'var(--fc-navy)' }} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <nav className="flex flex-col gap-3">
              <Link
                href="#how-it-works"
                className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition"
                style={{ color: 'var(--fc-navy)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#rules"
                className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition"
                style={{ color: 'var(--fc-navy)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Rules
              </Link>
              <Link
                href="#enter"
                className="btn btn-primary mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Enter Now
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
