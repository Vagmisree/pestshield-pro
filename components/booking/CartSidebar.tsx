'use client';

import { useState } from 'react';
import { useBookingStore } from '@/stores/useBookingStore';
import { X, ShoppingCart, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

function formatDate(date: Date | null) {
  if (!date) return '—';
  try { return format(new Date(date), 'dd MMM'); } catch { return '—'; }
}

export function CartSidebar() {
  const { cart, removeFromCart, getTotalCartAmount } = useBookingStore();
  const [isOpen, setIsOpen] = useState(false);

  if (cart.length === 0) return null;

  const totalCartAmount = getTotalCartAmount();

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-3 rounded-2xl shadow-lg transition-all active:scale-95"
      >
        <ShoppingCart className="w-4 h-4" />
        <span className="text-sm">{cart.length} in cart</span>
        <span className="bg-white text-brand-600 text-xs font-bold px-2 py-0.5 rounded-full">
          ₹{totalCartAmount.toLocaleString()}
        </span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer — desktop right, mobile bottom */}
      <div className={cn(
        'fixed z-50 bg-white shadow-2xl transition-transform duration-300',
        // Desktop: right drawer
        'md:top-0 md:right-0 md:h-full md:w-80 md:rounded-l-3xl',
        // Mobile: bottom sheet
        'bottom-0 left-0 right-0 rounded-t-3xl md:bottom-auto md:left-auto',
        isOpen
          ? 'translate-y-0 md:translate-x-0'
          : 'translate-y-full md:translate-y-0 md:translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-cream-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-ink">Booking Cart</h3>
            <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-cream-100 rounded-xl transition-colors"
          >
            <X className="w-4 h-4 text-neutral-500" />
          </button>
        </div>

        {/* Cart items */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh] md:max-h-[calc(100vh-200px)]">
          {cart.map((d, i) => (
            <div
              key={d.cartId}
              className="flex items-start justify-between gap-2 p-3 bg-cream-50 rounded-xl border border-cream-300"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-bold text-neutral-400">#{i + 1}</span>
                  <p className="font-semibold text-sm text-ink truncate">{d.selectedService}</p>
                </div>
                <p className="text-xs text-neutral-500 truncate">
                  {d.formData.address.slice(0, 35)}{d.formData.address.length > 35 ? '...' : ''}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {formatDate(d.selectedDate)} · {d.selectedTimeSlot}
                </p>
                <p className="text-sm font-bold text-brand-600 mt-1">
                  ₹{d.pricing?.totalAmount.toLocaleString() || '—'}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(d.cartId)}
                className="text-red-400 hover:text-red-600 p-1 flex-shrink-0 transition-colors"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cream-200">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-neutral-600">
              Subtotal ({cart.length} booking{cart.length > 1 ? 's' : ''})
            </span>
            <span className="font-bold text-ink">₹{totalCartAmount.toLocaleString()}</span>
          </div>
          <p className="text-xs text-neutral-400 mb-3">+GST · Paid together at checkout</p>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all text-sm"
          >
            Continue Booking
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
