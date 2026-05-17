'use client';

import { useBookingStore, PropertyType } from '@/stores/useBookingStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Building2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fadeUp, stagger } from '@/lib/animations';

interface Step3Props { onNext: () => void; onBack: () => void }

const residentialSizes = [
  { label: '1 BHK', icon: '🏠' },
  { label: '2 BHK', icon: '🏡' },
  { label: '3 BHK', icon: '🏘️' },
  { label: '4 BHK+', icon: '🏰' },
  { label: 'Villa', icon: '🏛️' },
  { label: 'Bungalow', icon: '🏗️' },
];

const commercialTypes = [
  { label: 'Office', icon: '🏢' },
  { label: 'Restaurant', icon: '🍽️' },
  { label: 'Hotel', icon: '🏨' },
  { label: 'Warehouse', icon: '🏭' },
  { label: 'Hospital', icon: '🏥' },
  { label: 'Other', icon: '🏬' },
];

export function Step3PropertyType({ onNext, onBack }: Step3Props) {
  const { propertyType, setPropertyType } = useBookingStore();

  const canContinue = propertyType?.type && (
    (propertyType.type === 'residential' && propertyType.size) ||
    (propertyType.type === 'commercial' && propertyType.areaType)
  );

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-ink mb-1">Your Property</h2>
      <p className="text-neutral-500 text-sm mb-6">This helps us plan the right service</p>

      {/* Stage 1 — Type */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {(['residential', 'commercial'] as const).map((type) => {
          const isSelected = propertyType?.type === type;
          return (
            <button
              key={type}
              onClick={() => setPropertyType({ type })}
              className={cn(
                'p-6 rounded-2xl border-2 cursor-pointer transition-all text-left',
                isSelected ? 'border-brand-600 bg-brand-50' : 'border-cream-300 bg-card hover:border-brand-400'
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                {type === 'residential' ? <Home className="w-6 h-6 text-brand-600" /> : <Building2 className="w-6 h-6 text-brand-600" />}
                <h3 className="font-heading font-bold text-ink capitalize">{type}</h3>
              </div>
              <p className="text-sm text-neutral-500">
                {type === 'residential' ? 'House, apartment, villa' : 'Office, restaurant, hotel'}
              </p>
            </button>
          );
        })}
      </div>

      {/* Stage 2 — Size options */}
      <AnimatePresence>
        {propertyType?.type === 'residential' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mb-6"
          >
            <p className="text-sm font-medium text-neutral-700 mb-3">Select property size</p>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid grid-cols-3 gap-3"
            >
              {residentialSizes.map((opt) => (
                <motion.button
                  key={opt.label}
                  variants={fadeUp}
                  onClick={() => setPropertyType({ type: 'residential', size: opt.label })}
                  className={cn(
                    'flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all text-sm font-medium',
                    propertyType.size === opt.label
                      ? 'bg-forest-900 border-forest-900 text-white'
                      : 'border-cream-300 bg-card text-neutral-700 hover:border-brand-400'
                  )}
                >
                  <span className="text-xl">{opt.icon}</span>
                  {opt.label}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}

        {propertyType?.type === 'commercial' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mb-6"
          >
            <p className="text-sm font-medium text-neutral-700 mb-3">Select commercial type</p>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid grid-cols-3 gap-3"
            >
              {commercialTypes.map((opt) => (
                <motion.button
                  key={opt.label}
                  variants={fadeUp}
                  onClick={() => setPropertyType({ type: 'commercial', areaType: opt.label })}
                  className={cn(
                    'flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all text-sm font-medium',
                    propertyType.areaType === opt.label
                      ? 'bg-forest-900 border-forest-900 text-white'
                      : 'border-cream-300 bg-card text-neutral-700 hover:border-brand-400'
                  )}
                >
                  <span className="text-xl">{opt.icon}</span>
                  {opt.label}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border-2 border-cream-300 text-neutral-700 font-semibold hover:border-neutral-400 transition-all">
          Back
        </button>
        <button
          onClick={() => canContinue && onNext()}
          disabled={!canContinue}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all disabled:opacity-40"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
