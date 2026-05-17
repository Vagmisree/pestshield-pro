/**
 * Google Maps Platform Integration
 * TODO: Implement in Part 2 (Technician assignment / distance calculation)
 */

import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(from: LatLng, to: LatLng): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Geocode an address to lat/lng using Google Maps API
 */
export async function geocodeAddress(address: string): Promise<LatLng | null> {
  if (!env.GOOGLE_MAPS_API_KEY) {
    logger.warn('[Maps] API key not configured');
    return null;
  }

  // TODO: Implement Google Geocoding API call
  return null;
}
