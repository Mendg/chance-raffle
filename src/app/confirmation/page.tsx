'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');

    if (redirectStatus === 'succeeded') {
      setStatus('success');
      setMessage('Your entry has been confirmed!');
    } else if (redirectStatus === 'processing') {
      setStatus('loading');
      setMessage('Your payment is processing...');
    } else if (redirectStatus === 'requires_payment_method') {
      setStatus('error');
      setMessage('Payment was not completed. Please try again.');
    } else if (!paymentIntent) {
      // Direct navigation without payment
      setStatus('success');
      setMessage('Thank you for your entry!');
    } else {
      setStatus('error');
      setMessage('Something went wrong with your payment.');
    }
  }, [searchParams]);

  return (
    <div className="card max-w-md w-full text-center py-12">
      {status === 'loading' && (
        <>
          <Loader2
            className="w-16 h-16 animate-spin mx-auto mb-6"
            style={{ color: 'var(--fc-teal)' }}
          />
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--fc-navy)' }}>
            Processing...
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }}>{message}</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'rgba(54, 187, 174, 0.1)' }}
          >
            <CheckCircle className="w-10 h-10" style={{ color: 'var(--fc-teal)' }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--fc-navy)' }}>
            You&apos;re In!
          </h1>
          <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
            {message}
          </p>
          <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
            Check your email for your entry number and confirmation details.
          </p>
          <Link href="/" className="btn btn-primary">
            Return Home
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
          >
            <AlertCircle className="w-10 h-10" style={{ color: '#ef4444' }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--fc-navy)' }}>
            Something Went Wrong
          </h1>
          <p className="mb-6" style={{ color: '#ef4444' }}>
            {message}
          </p>
          <Link href="/#enter" className="btn btn-primary">
            Try Again
          </Link>
        </>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="card max-w-md w-full text-center py-12">
      <Loader2
        className="w-16 h-16 animate-spin mx-auto mb-6"
        style={{ color: 'var(--fc-teal)' }}
      />
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--fc-navy)' }}>
        Loading...
      </h1>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--muted)' }}>
      <Suspense fallback={<LoadingFallback />}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
