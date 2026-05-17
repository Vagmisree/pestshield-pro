'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useBookingStore } from '@/stores/useBookingStore';
import { api } from '@/lib/api';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { stagger, fadeUp } from '@/lib/animations';
// Fallback to static data if API fails
import { services as staticServices } from '@/lib/data/services';

interface Step2Props { onNext: () => void; onBack: () => void }

export function Step2SelectService({ onNext, onBack }: Step2Props) {
  const { selectedService, setSelectedService } = useBookingStore();
  const searchParams = useSearchParams();

  const { data: apiServices } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then(r => r.data.data || []).catch(() => []),
    staleTime: 5 * 60 * 1000,
  });

  // Use API services if available, fallback to static
  const services = (apiServices && apiServices.length > 0) ? apiServices : staticServices;

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && services.length > 0) {
      const matched = services.find((s: { slug?: string; name?: string }) =>
        s.slug === serviceParam || s.name?.toLowerCase().replace(/\s+/g, '-') === serviceParam
      );
      if (matched) setSelectedService(matched.name, matched.id);
    }
  }, [searchParams, services, setSelectedService]);

  return (
    <div>
      <h2 className="font-display font-bold text-2xl text-ink mb-1">What&apos;s bothering you?</h2>
      <p className="text-neutral-500 text-sm mb-6">Select the type of pest problem</p>

      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid md:grid-cols-2 gap-4 mb-8">
        {services.map((service: { id: string; name: string; icon?: string; duration?: string; startingPrice?: number; chemicalType?: string }) => {
          const isSelected = selectedService === service.name;
          return (
            <motion.div key={service.id} variants={fadeUp}
              onClick={() => setSelectedService(service.name, service.id)}
              className={cn('relative rounded-2xl border-2 p-5 cursor-pointer transition-all group',
                isSelected ? 'border-brand-600 bg-brand-50 shadow-hover' : 'border-cream-300 bg-card hover:border-brand-400 hover:shadow-md')}>
              {isSelected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </motion.div>
              )}
              <div className="w-12 h-12 rounded-xl bg-cream-200 flex items-center justify-center mb-4 group-hover:bg-brand-50 transition-colors text-2xl">
                {service.icon || '🐛'}
              </div>
              <h3 className="font-display font-bold text-ink text-base mb-1">{service.name}</h3>
              <p className="text-xs text-neutral-500 mb-3">{service.duration}</p>
              <p className="text-lg font-display font-black text-brand-600">
                from ₹{service.startingPrice?.toLocaleString() || '999'}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      <p className="text-center text-sm text-neutral-500 mb-6">
        Not sure? <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-brand-600 font-medium hover:underline">Chat with our experts →</a>
      </p>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border-2 border-cream-300 text-neutral-700 font-semibold hover:border-neutral-400 transition-all">Back</button>
        <button onClick={() => selectedService && onNext()} disabled={!selectedService}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all disabled:opacity-40">
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
