'use client';

import { useState, useEffect } from 'react';
import { useBookingStore } from '@/stores/useBookingStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { BookingStepper } from '@/components/booking/BookingStepper';
import { Step1YourDetails } from '@/components/booking/Step1YourDetails';
import { Step2SelectService } from '@/components/booking/Step2SelectService';
import { Step3PropertyType } from '@/components/booking/Step3PropertyType';
import { Step4ChoosePlan } from '@/components/booking/Step4ChoosePlan';
import { Step5Schedule } from '@/components/booking/Step5Schedule';
import { Step6Review } from '@/components/booking/Step6Review';
import { Step7Payment } from '@/components/booking/Step7Payment';
import { Step8Confirmation } from '@/components/booking/Step8Confirmation';
import { OrderSummary } from '@/components/booking/OrderSummary';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

const stepLabels = [
  'Your Details',
  'Select Service',
  'Property Type',
  'Choose Plan',
  'Schedule',
  'Review',
  'Payment',
  'Confirmation',
];

export default function BookingPage() {
  const { step, setStep, resetBooking, formData } = useBookingStore();
  const { user } = useAuthStore();
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user && !formData.fullName) {
      const updateFormData = useBookingStore.getState().updateFormData;
      updateFormData({
        fullName: user.name,
        phone: user.phone,
        email: user.email,
        city: user.city,
      });
    }
  }, [user, formData.fullName]);

  const handleNext = () => {
    setDirection('forward');
    setStep(step + 1);
  };

  const handleBack = () => {
    setDirection('backward');
    setStep(step - 1);
  };

  const handleJumpToStep = (targetStep: number) => {
    if (targetStep < step) {
      setDirection('backward');
    } else {
      setDirection('forward');
    }
    setStep(targetStep);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1YourDetails onNext={handleNext} />;
      case 2:
        return <Step2SelectService onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Step3PropertyType onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <Step4ChoosePlan onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <Step5Schedule onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <Step6Review onNext={handleNext} onBack={handleBack} onJumpToStep={handleJumpToStep} />;
      case 7:
        return <Step7Payment onNext={handleNext} onBack={handleBack} />;
      case 8:
        return <Step8Confirmation onReset={resetBooking} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <BookingStepper currentStep={step} totalSteps={8} labels={stepLabels} />

      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: direction === 'forward' ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === 'forward' ? -80 : 80 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Sticky order summary — hide on step 8 */}
          {step !== 8 && (
            <div className="hidden md:block sticky top-24">
              <OrderSummary />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      {step !== 8 && (
        <div className="sticky bottom-0 bg-white border-t border-cream-300 shadow-lg">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div className="hidden md:block">
              {step > 1 && (
                <Button variant="ghost" onClick={handleBack}>
                  Back
                </Button>
              )}
            </div>

            <div className="flex-1 md:flex-none">
              {step === 7 ? (
                <Button
                  onClick={handleNext}
                  className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 text-white"
                  size="lg"
                >
                  Complete Payment
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 text-white"
                  size="lg"
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
