'use client';

import { useEffect, useRef } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (/^\d*$/.test(val)) {
      const newValue = value.split('');
      newValue[index] = val;
      const result = newValue.join('').slice(0, length);
      onChange(result);

      if (val && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join('').slice(0, index));
      }
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, length);
    onChange(digits);

    setTimeout(() => {
      const lastIndex = Math.min(digits.length - 1, length - 1);
      if (lastIndex >= 0) {
        inputRefs.current[lastIndex]?.focus();
      }
    }, 0);
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-lg font-bold border-2 border-neutral-200 rounded-lg focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none transition"
        />
      ))}
    </div>
  );
}
