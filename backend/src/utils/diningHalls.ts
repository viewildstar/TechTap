import { DiningHall } from '../types';

// MIT Dining Hall coordinates and information
export const DINING_HALLS: DiningHall[] = [
  {
    id: 'maseeh',
    name: 'Maseeh Hall',
    address: '305 Memorial Dr, Cambridge, MA 02139',
    coordinates: {
      latitude: 42.3601,
      longitude: -71.0942,
    },
    radius: 500, // meters
    hours: {
      breakfast: { open: '07:00', close: '10:00' },
      lunch: { open: '11:30', close: '14:00' },
      dinner: { open: '17:30', close: '20:00' },
    },
  },
  {
    id: 'next',
    name: 'Next House',
    address: '500 Memorial Dr, Cambridge, MA 02139',
    coordinates: {
      latitude: 42.3610,
      longitude: -71.0930,
    },
    radius: 500,
    hours: {
      breakfast: { open: '07:00', close: '10:00' },
      lunch: { open: '11:30', close: '14:00' },
      dinner: { open: '17:30', close: '20:00' },
    },
  },
  {
    id: 'baker',
    name: 'Baker House',
    address: '362 Memorial Dr, Cambridge, MA 02139',
    coordinates: {
      latitude: 42.3590,
      longitude: -71.0950,
    },
    radius: 500,
    hours: {
      breakfast: { open: '07:00', close: '10:00' },
      lunch: { open: '11:30', close: '14:00' },
      dinner: { open: '17:30', close: '20:00' },
    },
  },
  {
    id: 'simmons',
    name: 'Simmons Hall',
    address: '229 Vassar St, Cambridge, MA 02139',
    coordinates: {
      latitude: 42.3580,
      longitude: -71.0960,
    },
    radius: 500,
    hours: {
      breakfast: { open: '07:00', close: '10:00' },
      lunch: { open: '11:30', close: '14:00' },
      dinner: { open: '17:30', close: '20:00' },
    },
  },
  {
    id: 'mccormick',
    name: 'McCormick Hall',
    address: '320 Memorial Dr, Cambridge, MA 02139',
    coordinates: {
      latitude: 42.3605,
      longitude: -71.0945,
    },
    radius: 500,
    hours: {
      breakfast: { open: '07:00', close: '10:00' },
      lunch: { open: '11:30', close: '14:00' },
      dinner: { open: '17:30', close: '20:00' },
    },
  },
];

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find nearest dining hall to user's location
 */
export function findNearestDiningHall(
  userLat: number,
  userLon: number
): { hall: DiningHall; distance: number } | null {
  let nearest: DiningHall | null = null;
  let minDistance = Infinity;

  for (const hall of DINING_HALLS) {
    const distance = calculateDistance(
      userLat,
      userLon,
      hall.coordinates.latitude,
      hall.coordinates.longitude
    );

    if (distance < hall.radius && distance < minDistance) {
      nearest = hall;
      minDistance = distance;
    }
  }

  return nearest ? { hall: nearest, distance: minDistance } : null;
}

/**
 * Find all dining halls within radius
 */
export function findNearbyDiningHalls(
  userLat: number,
  userLon: number,
  radius: number = 500
): Array<{ hall: DiningHall; distance: number }> {
  const nearby: Array<{ hall: DiningHall; distance: number }> = [];

  for (const hall of DINING_HALLS) {
    const distance = calculateDistance(
      userLat,
      userLon,
      hall.coordinates.latitude,
      hall.coordinates.longitude
    );

    if (distance <= radius) {
      nearby.push({ hall, distance });
    }
  }

  // Sort by distance (nearest first)
  return nearby.sort((a, b) => a.distance - b.distance);
}

/**
 * Get dining hall by ID
 */
export function getDiningHallById(id: string): DiningHall | undefined {
  return DINING_HALLS.find((hall) => hall.id === id);
}

