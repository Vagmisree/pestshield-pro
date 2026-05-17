'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitted(true);
    setIsLoading(false);
    toast.success('Reset link sent to your email');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!isSubmitted ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-6 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Forgot Password?</h1>
            <p className="text-neutral-500 mb-8">
              No worries! Enter your email and we&apos;ll send you a link to reset your password.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                size="lg"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Reset Link Sent!</h1>
            <p className="text-neutral-500 mb-8">
              We&apos;ve sent a password reset link to <span className="font-medium">{email}</span>
            </p>

            <p className="text-sm text-neutral-500 mb-6">
              Check your email and click the link to reset your password. If you don&apos;t see it, check your spam folder.
            </p>

            <Button
              onClick={() => router.push('/login')}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white"
              size="lg"
            >
              Back to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
