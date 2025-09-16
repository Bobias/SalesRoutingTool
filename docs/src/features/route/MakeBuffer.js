export async function makeBufferFromFeature(feature, miles) {
  const meters = miles * 1609.344;
  const turf = await import('https://cdn.jsdelivr.net/npm/@turf/turf@6.5.0/turf.min.js');
  return turf.buffer(feature, meters, { units: 'meters' });
}
