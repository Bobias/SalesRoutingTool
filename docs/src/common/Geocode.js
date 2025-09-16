function ParseLatLng(Input) {
  const Parts = String(Input || '').split(',').map(s => s.trim());
  if (Parts.length === 2 && !isNaN(+Parts[0]) && !isNaN(+Parts[1])) {
    const Lat = +Parts[0], Lng = +Parts[1];
    if (Math.abs(Lat) <= 90 && Math.abs(Lng) <= 180) return { lat: Lat, lng: Lng };
  }
  return null;
}

export async function Geocode(Query) {
  const Direct = ParseLatLng(Query);
  if (Direct) return Direct;
  const Resp = await fetch('https://photon.komoot.io/api/?limit=1&q=' + encodeURIComponent(Query));
  if (!Resp.ok) throw new Error('Geocode network error');
  const Data = await Resp.json();
  if (!Data.features || !Data.features.length) throw new Error('No geocode result for "' + Query + '"');
  const [Lng, Lat] = Data.features[0].geometry.coordinates;
  return { lat: Lat, lng: Lng };
}
