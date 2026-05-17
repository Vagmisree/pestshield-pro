'use client';

import { useBookingStore } from '@/stores/useBookingStore';
import { toast } from 'sonner';
import { cities } from '@/lib/data/cities';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const step1Schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Must be a valid 10-digit phone'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().min(5, 'Please enter a valid address'),
  pincode: z.string().regex(/^\d{6}$/, 'Must be a valid 6-digit pincode'),
  city: z.string().min(1, 'Please select a city'),
});

type Step1FormData = z.infer<typeof step1Schema>;

interface Step1Props { onNext: () => void }

function FloatingInput({
  label, error, className, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <div className="relative">
      <input
        {...props}
        placeholder=" "
        className={cn(
          'peer w-full px-4 pt-6 pb-2 rounded-xl border bg-white text-sm text-ink outline-none transition-all',
          'border-cream-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400/15',
          className
        )}
      />
      <label className="absolute left-4 top-4 text-neutral-400 text-sm transition-all pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-brand-600 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs">
        {label}
      </label>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function Step1YourDetails({ onNext }: Step1Props) {
  const { formData, updateFormData, setPincodeAvailable, pincodeAvailable } = useBookingStore() as {
    formData: Step1FormData;
    updateFormData: (d: Partial<Step1FormData>) => void;
    setPincodeAvailable: (v: boolean | null) => void;
    pincodeAvailable: boolean | null;
  };
  const [isLoading, setIsLoading] = useState(false);
  const [checkingPincode, setCheckingPincode] = useState(false);

  const form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      pincode: formData.pincode,
      city: formData.city,
    },
  });

  const pincode = form.watch('pincode');
  const pincodeValid = /^\d{6}$/.test(pincode);

  // Check pincode serviceability from API
  useEffect(() => {
    if (!pincodeValid) { setPincodeAvailable(null); return; }
    setCheckingPincode(true);
    api.get(`/bookings/check-pincode/${pincode}`)
      .then(r => setPincodeAvailable(r.data.data?.available ?? true))
      .catch(() => setPincodeAvailable(true)) // fallback: assume available
      .finally(() => setCheckingPincode(false));
  }, [pincode, pincodeValid, setPincodeAvailable]);

  const onSubmit = async (data: Step1FormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    updateFormData(data);
    setIsLoading(false);
    onNext();
  };

  return (
    <div>
      <h2 className="font-display font-bold text-2xl text-ink mb-1">Your Details</h2>
      <p className="text-neutral-500 text-sm mb-6">We need this to schedule your service</p>

      <div className="bg-card rounded-3xl shadow-card border border-cream-300 p-6 md:p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <FloatingInput
              label="Full Name *"
              {...form.register('fullName')}
              error={form.formState.errors.fullName?.message}
            />
            {/* Phone with +91 prefix */}
            <div className="relative">
              <div className="flex">
                <span className="flex items-center px-3 bg-cream-200 border border-r-0 border-cream-300 rounded-l-xl text-sm text-neutral-600 font-medium">+91</span>
                <input
                  {...form.register('phone')}
                  placeholder=" "
                  maxLength={10}
                  onChange={(e) => form.setValue('phone', e.target.value.replace(/\D/g, ''))}
                  className="peer flex-1 px-4 pt-6 pb-2 rounded-r-xl border border-cream-300 bg-white text-sm text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 transition-all"
                />
                <label className="absolute left-[52px] top-4 text-neutral-400 text-sm transition-all pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-brand-600 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs">
                  Phone *
                </label>
              </div>
              {form.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{form.formState.errors.phone.message}</p>}
            </div>
          </div>

          <FloatingInput
            label="Email (optional)"
            type="email"
            {...form.register('email')}
            error={form.formState.errors.email?.message}
          />

          <div className="relative">
            <textarea
              {...form.register('address')}
              placeholder=" "
              rows={2}
              className={cn(
                'peer w-full px-4 pt-6 pb-2 rounded-xl border bg-white text-sm text-ink outline-none transition-all resize-none',
                'border-cream-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15',
                form.formState.errors.address && 'border-red-400'
              )}
            />
            <label className="absolute left-4 top-4 text-neutral-400 text-sm transition-all pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-brand-600 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs">
              Full Address *
            </label>
            {form.formState.errors.address && <p className="text-red-500 text-xs mt-1">{form.formState.errors.address.message}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Pincode with check */}
            <div>
              <div className="relative">
                <input
                  {...form.register('pincode')}
                  placeholder=" "
                  maxLength={6}
                  onChange={(e) => form.setValue('pincode', e.target.value.replace(/\D/g, ''))}
                  className={cn(
                    'peer w-full px-4 pt-6 pb-2 pr-10 rounded-xl border bg-white text-sm text-ink outline-none transition-all',
                    'border-cream-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15',
                    form.formState.errors.pincode && 'border-red-400'
                  )}
                />
                <label className="absolute left-4 top-4 text-neutral-400 text-sm transition-all pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-brand-600 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs">
                  Pincode *
                </label>
                {pincodeValid && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                )}
              </div>
                {pincodeValid && pincodeAvailable === true && <p className="text-emerald-600 text-xs mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Service available in your area</p>}
                {pincodeValid && pincodeAvailable === false && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><XCircle className="w-3 h-3" /> Not serviceable yet</p>}
                {pincodeValid && checkingPincode && <p className="text-neutral-400 text-xs mt-1">Checking availability...</p>}
              {form.formState.errors.pincode && <p className="text-red-500 text-xs mt-1">{form.formState.errors.pincode.message}</p>}
            </div>

            {/* City — shadcn Select */}
            <div>
              <Select
                defaultValue={formData.city}
                onValueChange={(val) => form.setValue('city', val)}
              >
                <SelectTrigger className="h-[54px] rounded-xl border-cream-300 bg-white text-sm focus:ring-brand-600/15 focus:border-brand-600">
                  <SelectValue placeholder="Select City *" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.city}>{city.city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.city && <p className="text-red-500 text-xs mt-1">{form.formState.errors.city.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all disabled:opacity-60"
          >
            {isLoading ? 'Saving...' : 'Continue'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
