import express from 'express';
import { findNearestDiningHall, findNearbyDiningHalls, getDiningHallById, DINING_HALLS } from '../utils/diningHalls';

const router = express.Router();

/**
 * GET /api/dining-halls/nearby
 * Find nearby dining halls by coordinates
 */
router.get('/nearby', (req, res) => {
  const { latitude, longitude, radius } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({
      error: 'latitude and longitude are required',
    });
  }

  const lat = parseFloat(latitude as string);
  const lon = parseFloat(longitude as string);
  const searchRadius = radius ? parseFloat(radius as string) : 500;

  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({
      error: 'Invalid latitude or longitude',
    });
  }

  const nearby = findNearbyDiningHalls(lat, lon, searchRadius);
  const nearest = nearby.length > 0 ? nearby[0] : null;

  res.json({
    diningHalls: nearby.map(({ hall, distance }) => ({
      id: hall.id,
      name: hall.name,
      address: hall.address,
      distance: Math.round((distance / 1609.34) * 100) / 100, // Convert to miles
      coordinates: hall.coordinates,
      isOpen: isDiningHallOpen(hall), // TODO: Implement based on current time
      hours: hall.hours,
    })),
    nearest: nearest
      ? {
          id: nearest.hall.id,
          name: nearest.hall.name,
          distance: Math.round((nearest.distance / 1609.34) * 100) / 100,
        }
      : null,
  });
});

/**
 * GET /api/dining-halls/:id
 * Get dining hall by ID
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const hall = getDiningHallById(id);

  if (!hall) {
    return res.status(404).json({ error: 'Dining hall not found' });
  }

  res.json({
    id: hall.id,
    name: hall.name,
    address: hall.address,
    coordinates: hall.coordinates,
    isOpen: isDiningHallOpen(hall),
    hours: hall.hours,
  });
});

/**
 * GET /api/dining-halls
 * Get all dining halls
 */
router.get('/', (req, res) => {
  res.json({
    diningHalls: DINING_HALLS.map((hall) => ({
      id: hall.id,
      name: hall.name,
      address: hall.address,
      coordinates: hall.coordinates,
      isOpen: isDiningHallOpen(hall),
      hours: hall.hours,
    })),
  });
});

// Helper function to check if dining hall is open
function isDiningHallOpen(hall: any): boolean {
  // TODO: Implement based on current time and hall.hours
  // For now, return true
  return true;
}

export default router;

