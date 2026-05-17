'use client';

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function BookingStepper({ currentStep, totalSteps, labels }: StepperProps) {
  return (
    <div className="sticky top-0 z-20 bg-cream-50/95 backdrop-blur-md border-b border-cream-300 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Mobile: progress bar */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-500">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm font-semibold text-ink">{labels[currentStep - 1]}</span>
          </div>
          <div className="h-1.5 w-full bg-cream-300 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-600 rounded-full"
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {/* Desktop: full stepper */}
        <div className="hidden md:flex items-center">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div key={index} className="flex items-center flex-1 last:flex-initial">
                {/* Circle + label */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'relative w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm mb-1.5 transition-all',
                    isCompleted ? 'bg-emerald-400 text-white' :
                    isCurrent ? 'bg-forest-900 text-white shadow-glow' :
                    'bg-cream-200 text-neutral-400'
                  )}>
                    {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
                    {isCurrent && (
                      <span className="absolute inset-0 rounded-full border-2 border-forest-900 animate-ping opacity-30" />
                    )}
                  </div>
                  <p className={cn(
                    'text-[11px] text-center font-display font-medium whitespace-nowrap',
                    isCurrent ? 'text-forest-900' : isCompleted ? 'text-emerald-600' : 'text-neutral-400'
                  )}>
                    {labels[index]}
                  </p>
                </div>

                {/* Connector */}
                {index < totalSteps - 1 && (
                  <div className="flex-1 h-0.5 mx-2 mt-[-1.25rem] bg-cream-300 rounded-full overflow-hidden relative">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-emerald-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
