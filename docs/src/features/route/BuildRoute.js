export async function BuildRoute(Points) {
  const Coords = Points.map(P => `${P.lng},${P.lat}`).join(';');
  const Url = `https://router.project-osrm.org/route/v1/driving/${Coords}?overview=full&geometries=geojson`;
  const R = await fetch(Url);
  if (!R.ok) throw new Error('Routing network error');
  const J = await R.json();
  if (!J.routes || !J.routes.length) throw new Error('No route returned');
  return J.routes[0].geometry; // GeoJSON LineString
}
