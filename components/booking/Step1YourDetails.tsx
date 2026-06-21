'use client';

import { useBookingStore } from '@/stores/useBookingStore';
import { toast } from 'sonner';
import { useState, useEffect, useCallback, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowRight, CheckCircle, XCircle, Search, Navigation2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

const step1Schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Must be a valid 10-digit phone'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().min(5, 'Please enter a valid address'),
  pincode: z.string().regex(/^\d{6}$/, 'Must be a valid 6-digit pincode'),
  city: z.string().min(1, 'Please select a city'),
  landmark: z.string().optional(),
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

// ─── Google Maps Location Picker ─────────────────────────────────────────────

interface LocationData {
  address: string;
  pincode: string;
  city: string;
  lat: number;
  lng: number;
}

function LocationPicker({ onLocationSelected }: { onLocationSelected: (data: LocationData) => void }) {
  const [searchInput, setSearchInput] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const INDIA_CENTER = { lat: 17.385, lng: 78.4867 };
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) { setMapError(true); return; }
    if (typeof window === 'undefined') return;

    // Check if already loaded
    if (window.google?.maps) { initMap(); return; }

    // Load script
    const scriptId = 'google-maps-script';
    if (document.getElementById(scriptId)) {
      const check = setInterval(() => {
        if (window.google?.maps) { clearInterval(check); initMap(); }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => initMap();
    script.onerror = () => setMapError(true);
    document.head.appendChild(script);
  }, [apiKey]);

  const parseAndSetAddress = useCallback((
    components: google.maps.GeocoderAddressComponent[],
    formatted: string,
    lat: number,
    lng: number
  ) => {
    const get = (type: string) => components.find(c => c.types.includes(type))?.long_name || '';
    const pincode = get('postal_code');
    const city = get('locality') || get('administrative_area_level_2');
    setResolvedAddress(formatted);
    setSearchInput(formatted);
    onLocationSelected({ address: formatted, pincode, city, lat, lng });
  }, [onLocationSelected]);

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google?.maps) return;

    geocoderRef.current = new google.maps.Geocoder();

    googleMapRef.current = new google.maps.Map(mapRef.current, {
      center: INDIA_CENTER,
      zoom: 13,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }],
    });

    markerRef.current = new google.maps.Marker({
      position: INDIA_CENTER,
      map: googleMapRef.current,
      draggable: true,
    });

    // Reverse geocode on marker drag end
    markerRef.current.addListener('dragend', () => {
      const pos = markerRef.current?.getPosition();
      if (!pos) return;
      geocoderRef.current?.geocode({ location: { lat: pos.lat(), lng: pos.lng() } }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          parseAndSetAddress(results[0].address_components, results[0].formatted_address, pos.lat(), pos.lng());
        }
      });
    });

    // Autocomplete
    if (searchInputRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(searchInputRef.current, {
        componentRestrictions: { country: 'IN' },
        fields: ['geometry', 'formatted_address', 'address_components'],
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current!.getPlace();
        if (!place.geometry?.location) return;
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        googleMapRef.current?.setCenter({ lat, lng });
        googleMapRef.current?.setZoom(16);
        markerRef.current?.setPosition({ lat, lng });
        parseAndSetAddress(place.address_components!, place.formatted_address!, lat, lng);
      });
    }

    setIsLoaded(true);
  }, [parseAndSetAddress]);

  const useMyLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        googleMapRef.current?.setCenter({ lat, lng });
        googleMapRef.current?.setZoom(16);
        markerRef.current?.setPosition({ lat, lng });
        geocoderRef.current?.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            parseAndSetAddress(results[0].address_components, results[0].formatted_address, lat, lng);
          }
        });
      },
      () => toast.error('Could not detect your location')
    );
  };

  // Fallback: manual address input when Maps API key not set
  if (mapError || !apiKey) {
    return (
      <div className="space-y-2">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs text-amber-700">
            📍 Google Maps not configured. Add <code className="font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to .env.local to enable map picker.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          ref={searchInputRef}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search your address..."
          className="w-full pl-9 pr-12 py-3 rounded-xl border border-cream-300 bg-white text-sm text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15"
        />
        <button
          type="button"
          onClick={useMyLocation}
          title="Use my location"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-brand-50 rounded-lg text-brand-600 hover:bg-brand-100 transition-colors"
        >
          <Navigation2 className="w-4 h-4" />
        </button>
      </div>

      {/* Map container */}
      <div className="relative overflow-hidden rounded-2xl border border-cream-300" style={{ height: '280px' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        {!isLoaded && (
          <div className="absolute inset-0 bg-cream-100 animate-pulse flex items-center justify-center">
            <p className="text-neutral-400 text-sm">Loading map...</p>
          </div>
        )}
        {isLoaded && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur text-xs text-neutral-600 px-3 py-1.5 rounded-full shadow-md border border-cream-300 pointer-events-none">
            📍 Drag pin to adjust location
          </div>
        )}
      </div>

      {/* Resolved address */}
      {resolvedAddress && (
        <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-emerald-600 font-medium">Location Confirmed</p>
            <p className="text-sm text-ink mt-0.5">{resolvedAddress}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 1 Component ─────────────────────────────────────────────────────────

export function Step1YourDetails({ onNext }: Step1Props) {
  const { formData, updateFormData, setPincodeAvailable, pincodeAvailable, setCoords } = useBookingStore() as {
    formData: Step1FormData;
    updateFormData: (d: Partial<Step1FormData>) => void;
    setPincodeAvailable: (v: boolean | null) => void;
    pincodeAvailable: boolean | null;
    setCoords: (c: { lat: number; lng: number } | null) => void;
  };
  const [isLoading, setIsLoading] = useState(false);
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [localCoords, setLocalCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [useMapPicker, setUseMapPicker] = useState(!!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

  const form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      pincode: formData.pincode,
      city: formData.city,
      landmark: formData.landmark || '',
    },
  });

  const pincode = form.watch('pincode');
  const pincodeValid = /^\d{6}$/.test(pincode);

  useEffect(() => {
    if (!pincodeValid) { setPincodeAvailable(null); return; }
    setCheckingPincode(true);
    api.get(`/bookings/check-pincode/${pincode}`)
      .then(r => setPincodeAvailable(r.data.data?.available ?? true))
      .catch(() => setPincodeAvailable(true))
      .finally(() => setCheckingPincode(false));
  }, [pincode, pincodeValid, setPincodeAvailable]);

  const onSubmit = async (data: Step1FormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    updateFormData(data);
    if (localCoords) setCoords(localCoords);
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

          {/* Address section — Map picker or manual */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-neutral-600">Your Service Address *</label>
              <button
                type="button"
                onClick={() => setUseMapPicker(!useMapPicker)}
                className="text-xs text-brand-600 hover:underline"
              >
                {useMapPicker ? 'Enter manually' : 'Use map picker'}
              </button>
            </div>

            {useMapPicker ? (
              <LocationPicker
                onLocationSelected={({ address, pincode, city, lat, lng }) => {
                  form.setValue('address', address);
                  form.setValue('pincode', pincode);
                  form.setValue('city', city);
                  setLocalCoords({ lat, lng });
                  if (/^\d{6}$/.test(pincode)) {
                    setPincodeAvailable(null);
                    api.get(`/bookings/check-pincode/${pincode}`)
                      .then(r => setPincodeAvailable(r.data.data?.available ?? true))
                      .catch(() => setPincodeAvailable(true));
                  }
                }}
              />
            ) : (
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
            )}

            {/* Pincode availability */}
            {pincodeValid && pincodeAvailable === true && (
              <p className="text-emerald-600 text-xs flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Service available in your area
              </p>
            )}
            {pincodeValid && pincodeAvailable === false && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <XCircle className="w-3 h-3" /> Not serviceable yet
              </p>
            )}
            {pincodeValid && checkingPincode && (
              <p className="text-neutral-400 text-xs">Checking availability...</p>
            )}
          </div>

          {/* Manual pincode + city (shown when not using map picker, or as override) */}
          {!useMapPicker && (
            <div className="grid md:grid-cols-2 gap-5">
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
                  {pincodeValid && <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />}
                </div>
                {form.formState.errors.pincode && <p className="text-red-500 text-xs mt-1">{form.formState.errors.pincode.message}</p>}
              </div>

              <FloatingInput
                label="City *"
                {...form.register('city')}
                error={form.formState.errors.city?.message}
              />
            </div>
          )}

          {/* Landmark */}
          <FloatingInput
            label="Landmark (optional)"
            {...form.register('landmark')}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <>Continue <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
