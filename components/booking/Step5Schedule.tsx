'use client';

import { useBookingStore } from '@/stores/useBookingStore';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { addDays } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step5Props { onNext: () => void; onBack: () => void }

const slots = [
  { id: 'morning', emoji: '🌅', label: 'Morning', time: '9 AM – 12 PM', available: 5 },
  { id: 'afternoon', emoji: '☀️', label: 'Afternoon', time: '12 PM – 3 PM', available: 3 },
  { id: 'evening', emoji: '🌆', label: 'Evening', time: '3 PM – 6 PM', available: 8 },
];

export function Step5Schedule({ onNext, onBack }: Step5Props) {
  const { selectedDate, selectedTimeSlot, setSelectedDate, setSelectedTimeSlot } = useBookingStore();
  const [localDate, setLocalDate] = useState<Date | undefined>(selectedDate || new Date());

  const handleDateSelect = (date: Date | undefined) => {
    if (date) { setLocalDate(date); setSelectedDate(date); }
  };

  return (
    <div>
      <h2 className="font-display font-bold text-2xl text-ink mb-1">When works for you?</h2>
      <p className="text-neutral-500 text-sm mb-6">Select your preferred date and time slot</p>

      <div className="grid md:grid-cols-5 gap-6 mb-6">
        {/* Calendar */}
        <div className="md:col-span-2">
          <Calendar
            mode="single"
            selected={localDate}
            onSelect={handleDateSelect}
            disabled={(date) => date.getDay() === 0 || date < new Date()}
            fromDate={new Date()}
            toDate={addDays(new Date(), 30)}
            className="rounded-2xl border border-cream-300 bg-card p-4 shadow-card w-full"
            classNames={{
              day_selected: 'bg-forest-900 text-white hover:bg-forest-800 focus:bg-forest-900 rounded-full',
              day_today: 'text-brand-600 font-bold',
              nav_button: 'hover:bg-cream-200 rounded-xl',
            }}
          />
          <p className="text-xs text-neutral-400 text-center mt-2">Sundays unavailable</p>
        </div>

        {/* Time Slot Cards */}
        <div className="md:col-span-3 space-y-3">
          {slots.map((slot) => {
            const isSelected = selectedTimeSlot === slot.id || selectedTimeSlot === slot.label;
            return (
              <button
                key={slot.id}
                onClick={() => setSelectedTimeSlot(slot.label)}
                className={cn(
                  'w-full rounded-2xl border-2 p-4 text-left transition-all',
                  isSelected
                    ? 'border-brand-600 bg-brand-50 shadow-card'
                    : 'border-cream-300 bg-card hover:border-brand-400'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{slot.emoji}</span>
                    <div>
                      <p className="font-display font-bold text-ink">{slot.label}</p>
                      <p className="text-xs text-neutral-500">{slot.time}</p>
                    </div>
                  </div>
                  <span className={cn(
                    'text-xs font-semibold px-2.5 py-1 rounded-full',
                    slot.available > 5 ? 'bg-emerald-400/10 text-emerald-600' :
                    slot.available > 2 ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-600'
                  )}>
                    {slot.available} slots
                  </span>
                </div>
                {slot.id === 'morning' && (
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    ⚡ Fastest Available
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl mb-6 text-sm text-brand-700">
        ℹ️ Technician will confirm 2 hours before your slot via WhatsApp
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl border-2 border-cream-300 text-neutral-700 font-semibold hover:border-neutral-400 transition-all">
          Back
        </button>
        <button
          onClick={() => localDate && selectedTimeSlot && onNext()}
          disabled={!localDate || !selectedTimeSlot}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all disabled:opacity-40"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
