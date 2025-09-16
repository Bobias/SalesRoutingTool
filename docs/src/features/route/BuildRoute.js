export async function buildRoute(points) {
  const coords = points.map(p => `${p.lng},${p.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('Routing network error');
  const j = await r.json();
  if (!j.routes || !j.routes.length) throw new Error('No route returned');
  return j.routes[0].geometry; // GeoJSON LineString
}
