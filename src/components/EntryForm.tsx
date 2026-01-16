'use client';

import { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface EntryFormData {
  name: string;
  email: string;
  phone: string;
}

interface ConfirmedEntry {
  assignedNumber: number;
  amountCharged: number;
  name: string;
}

function NumberReveal({ finalNumber, onComplete }: { finalNumber: number; onComplete: () => void }) {
  const [displayNumber, setDisplayNumber] = useState(0);
  const [phase, setPhase] = useState<'spinning' | 'slowing' | 'revealed'>('spinning');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let speed = 50;
    let iterations = 0;
    const maxIterations = 30;

    const spin = () => {
      iterations++;
      setDisplayNumber(Math.floor(Math.random() * 360) + 1);

      if (iterations < maxIterations * 0.6) {
        // Fast spinning
        intervalRef.current = setTimeout(spin, speed);
      } else if (iterations < maxIterations) {
        // Slowing down
        setPhase('slowing');
        speed += 30;
        intervalRef.current = setTimeout(spin, speed);
      } else {
        // Reveal final number
        setDisplayNumber(finalNumber);
        setPhase('revealed');
        setTimeout(onComplete, 500);
      }
    };

    intervalRef.current = setTimeout(spin, speed);

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [finalNumber, onComplete]);

  return (
    <div className="relative">
      <div
        className={`
          p-8 rounded-2xl inline-block transition-all duration-500
          ${phase === 'revealed' ? 'scale-110' : 'scale-100'}
        `}
        style={{
          backgroundColor: 'var(--fc-navy)',
          boxShadow: phase === 'revealed'
            ? '0 0 60px rgba(27, 54, 93, 0.5), 0 0 100px rgba(54, 187, 174, 0.3)'
            : '0 10px 40px rgba(27, 54, 93, 0.3)'
        }}
      >
        <p className="text-white/80 text-sm mb-2">
          {phase === 'revealed' ? 'Your Entry Number' : 'Finding your number...'}
        </p>
        <p
          className={`
            text-6xl sm:text-7xl font-bold text-white tabular-nums
            ${phase === 'spinning' ? 'blur-[2px]' : ''}
            ${phase === 'slowing' ? 'blur-[1px]' : ''}
            ${phase === 'revealed' ? 'animate-bounce-once' : ''}
          `}
        >
          #{displayNumber}
        </p>
      </div>
      {phase === 'revealed' && (
        <div className="absolute -top-4 -right-4">
          <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
        </div>
      )}
    </div>
  );
}

function PaymentForm({
  formData,
  clientSecret,
  paymentIntentId,
  onSuccess,
  onError,
}: {
  formData: EntryFormData;
  clientSecret: string;
  paymentIntentId: string;
  onSuccess: (entry: ConfirmedEntry) => void;
  onError: (message: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // First confirm the PaymentIntent with Stripe
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/confirmation`,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        onError(stripeError.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      // Payment authorized - now create the entry and capture
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paymentIntentId,
        }),
      });

      const result = await response.json();

      if (result.success && result.entry) {
        onSuccess({
          assignedNumber: result.entry.assignedNumber,
          amountCharged: result.entry.amountCharged,
          name: result.entry.name,
        });
      } else {
        onError(result.error || 'Failed to create entry');
      }
    } catch (error) {
      onError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
        <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
          Your card will be authorized for $360. You&apos;ll only be charged your
          randomly assigned amount ($1-$360).
        </p>
        <PaymentElement
          onReady={() => setPaymentReady(true)}
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || !paymentReady || isProcessing}
        className="btn btn-primary w-full text-lg py-4"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          'Enter Raffle - Authorize $360'
        )}
      </button>
    </form>
  );
}

export default function EntryForm() {
  const [step, setStep] = useState<'form' | 'payment' | 'revealing' | 'success' | 'error'>('form');
  const [formData, setFormData] = useState<EntryFormData>({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<EntryFormData>>({});
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [confirmedEntry, setConfirmedEntry] = useState<ConfirmedEntry | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAmount, setShowAmount] = useState(false);

  function validateForm(): boolean {
    const newErrors: Partial<EntryFormData> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name';
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleContinueToPayment(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.error) {
        setErrorMessage(data.error);
        setStep('error');
        return;
      }

      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setStep('payment');
    } catch (error) {
      setErrorMessage('Failed to initialize payment. Please try again.');
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  }

  function handlePaymentSuccess(entry: ConfirmedEntry) {
    setConfirmedEntry(entry);
    setShowAmount(false);
    setStep('revealing');
  }

  function handleRevealComplete() {
    setShowAmount(true);
    setStep('success');
  }

  function handlePaymentError(message: string) {
    setErrorMessage(message);
    setStep('error');
  }

  function handleReset() {
    setStep('form');
    setFormData({ name: '', email: '', phone: '' });
    setErrors({});
    setClientSecret(null);
    setPaymentIntentId(null);
    setConfirmedEntry(null);
    setErrorMessage(null);
  }

  if (step === 'revealing' && confirmedEntry) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--fc-navy)' }}>
          Drumroll please...
        </h2>
        <p className="mb-8" style={{ color: 'var(--muted-foreground)' }}>
          {confirmedEntry.name.split(' ')[0]}, your number is being revealed!
        </p>

        <NumberReveal
          finalNumber={confirmedEntry.assignedNumber}
          onComplete={handleRevealComplete}
        />
      </div>
    );
  }

  if (step === 'success' && confirmedEntry) {
    return (
      <div className="card text-center py-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in"
          style={{ backgroundColor: 'rgba(54, 187, 174, 0.1)' }}
        >
          <CheckCircle className="w-10 h-10" style={{ color: 'var(--fc-teal)' }} />
        </div>

        <h2 className="text-2xl font-bold mb-2 animate-fade-in" style={{ color: 'var(--fc-navy)' }}>
          You&apos;re In!
        </h2>
        <p className="mb-6 animate-fade-in" style={{ color: 'var(--muted-foreground)' }}>
          Thank you, {confirmedEntry.name.split(' ')[0]}!
        </p>

        <div
          className="p-8 rounded-2xl mb-6 inline-block"
          style={{
            backgroundColor: 'var(--fc-navy)',
            boxShadow: '0 0 60px rgba(27, 54, 93, 0.5), 0 0 100px rgba(54, 187, 174, 0.3)'
          }}
        >
          <p className="text-white/80 text-sm mb-2">Your Entry Number</p>
          <p className="text-6xl sm:text-7xl font-bold text-white">
            #{confirmedEntry.assignedNumber}
          </p>
        </div>

        {showAmount && (
          <div className="animate-fade-in">
            <p className="text-xl mb-2" style={{ color: 'var(--fc-navy)' }}>
              You paid only
            </p>
            <p
              className="text-4xl font-bold mb-4"
              style={{ color: 'var(--fc-teal)' }}
            >
              ${(confirmedEntry.amountCharged / 100).toFixed(0)}
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
              A confirmation email has been sent to your inbox.
            </p>
          </div>
        )}

        <button onClick={handleReset} className="btn btn-outline animate-fade-in">
          Enter Another Number
        </button>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="card text-center py-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
        >
          <AlertCircle className="w-10 h-10" style={{ color: '#ef4444' }} />
        </div>

        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--fc-navy)' }}>
          Something Went Wrong
        </h2>
        <p className="mb-6" style={{ color: '#ef4444' }}>
          {errorMessage}
        </p>

        <button onClick={handleReset} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (step === 'payment' && clientSecret && paymentIntentId) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--fc-navy)' }}>
          Complete Your Entry
        </h2>
        <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
          Entering as {formData.name}
        </p>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#36bbae',
                colorBackground: '#ffffff',
                colorText: '#1b365d',
                colorDanger: '#ef4444',
                fontFamily: 'Proxima Nova, system-ui, sans-serif',
                borderRadius: '8px',
              },
            },
          }}
        >
          <PaymentForm
            formData={formData}
            clientSecret={clientSecret}
            paymentIntentId={paymentIntentId}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </Elements>

        <button
          onClick={() => setStep('form')}
          className="w-full mt-4 text-sm"
          style={{ color: 'var(--muted-foreground)' }}
        >
          &larr; Back to details
        </button>
      </div>
    );
  }

  return (
    <div id="enter" className="card">
      <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--fc-navy)' }}>
        Enter the Raffle
      </h2>
      <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
        Fill in your details to get started
      </p>

      <form onSubmit={handleContinueToPayment} className="space-y-4">
        <div>
          <label htmlFor="name" className="label">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            className={`input ${errors.name ? 'border-red-500' : ''}`}
            placeholder="John Smith"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className={`input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="label">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            className={`input ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          {errors.phone && <p className="error-message">{errors.phone}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full text-lg py-4 mt-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading...
            </>
          ) : (
            'Continue to Payment'
          )}
        </button>
      </form>

      <p className="text-xs text-center mt-4" style={{ color: 'var(--muted-foreground)' }}>
        By entering, you agree to the raffle terms and conditions.
        Your payment information is securely processed by Stripe.
      </p>
    </div>
  );
}
