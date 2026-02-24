export function estimateETA(distanceKm: number) {
  if (!distanceKm || distanceKm <= 0) return "--";

  const distanceMeters = distanceKm * 1000;

  // walking (inside society / lanes)
  if (distanceMeters <= 700) {
    const walkingSpeed = 4.5; // km/h
    const hours = distanceKm / walkingSpeed;
    return Math.round(hours * 60);
  }

  // city bike traffic (realistic Indian traffic)
  if (distanceKm <= 5) {
    const bikeSpeed = 18; // km/h
    const hours = distanceKm / bikeSpeed;
    return Math.round(hours * 60);
  }

  // longer distance
  const fastBike = 28;
  const hours = distanceKm / fastBike;
  return Math.round(hours * 60);
}


export function calculateSpeedKmH(
  prev: { lat: number; lng: number; time: number },
  next: { lat: number; lng: number; time: number }
) {
  const R = 6371; // earth radius km

  const dLat = ((next.lat - prev.lat) * Math.PI) / 180;
  const dLng = ((next.lng - prev.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((prev.lat * Math.PI) / 180) *
      Math.cos((next.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  const hours = (next.time - prev.time) / 3600000;

  if (hours <= 0) return 0;

  return distanceKm / hours;
}

export function calculateLiveETA(distanceKm: number, speedKmH: number) {
  if (!speedKmH || speedKmH < 3) return null; // worker stopped

  const hours = distanceKm / speedKmH;
  return Math.round(hours * 60);
}