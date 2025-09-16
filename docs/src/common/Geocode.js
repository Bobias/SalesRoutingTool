function parseLatLng(input) {
  const parts = String(input || '').split(',').map(s => s.trim());
  if (parts.length === 2 && !isNaN(+parts[0]) && !isNaN(+parts[1])) {
    const lat = +parts[0], lng = +parts[1];
    if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
  }
  return null;
}

export async function geocode(query) {
  const direct = parseLatLng(query);
  if (direct) return direct;
  const resp = await fetch('https://photon.komoot.io/api/?limit=1&q=' + encodeURIComponent(query));
  if (!resp.ok) throw new Error('Geocode network error');
  const data = await resp.json();
  if (!data.features || !data.features.length) throw new Error('No geocode result for "' + query + '"');
  const [lng, lat] = data.features[0].geometry.coordinates;
  return { lat, lng };
}
