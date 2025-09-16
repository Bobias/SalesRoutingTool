export async function MakeBuffer(Feature, Miles) {
  const Meters = Miles * 1609.344;
  const Turf = await import('https://cdn.jsdelivr.net/npm/@turf/turf@6.5.0/+esm');
  return Turf.buffer(Feature, Meters, { units: 'meters' });
}

