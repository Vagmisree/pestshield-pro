// Mock Google Maps — uses Haversine formula (no API key needed)

export interface LatLng { lat: number; lng: number }

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

function haversineKm(from: LatLng, to: LatLng): number {
  const R = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function getDrivingMinutes(from: LatLng, to: LatLng): Promise<number> {
  const km = haversineKm(from, to);
  // Assume 20 km/h average in Indian city traffic
  return Math.round((km / 20) * 60);
}

export async function getDistanceKm(from: LatLng, to: LatLng): Promise<number> {
  return haversineKm(from, to);
}

export async function geocodeAddress(_address: string): Promise<LatLng> {
  // Return Hyderabad center as default for dev
  return { lat: 17.3850, lng: 78.4867 };
}
