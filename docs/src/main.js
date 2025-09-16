import { initMap } from './common/initMap.js';
import { geocode } from './common/geocode.js';
import { buildRoute } from './features/route/buildRoute.js';
import { makeBufferFromFeature } from './features/route/makeBuffer.js';

const { map, L } = initMap();

let routeLayer = null;
let bufferLayer = null;
let routeFeature = null;

function drawGeoJson(fc, style) {
  const layer = L.geoJSON(fc, { style });
  layer.addTo(map);
  return layer;
}

function clearMap() {
  if (routeLayer) { map.removeLayer(routeLayer); routeLayer = null; }
  if (bufferLayer) { map.removeLayer(bufferLayer); bufferLayer = null; }
  routeFeature = null;
}

document.getElementById('buildRoute').addEventListener('click', async () => {
  const origin = document.getElementById('origin').value.trim();
  const destination = document.getElementById('destination').value.trim();
  const stops = document.getElementById('stops').value.split(/\n+/).map(s => s.trim()).filter(Boolean);

  if (!origin || !destination) { alert('Enter origin and destination'); return; }

  try {
    const O = await geocode(origin);
    const D = await geocode(destination);
    const W = [];
    for (const s of stops) W.push(await geocode(s));

    const line = await buildRoute([O, ...W, D]);
    routeFeature = { type: 'Feature', properties: {}, geometry: line };

    if (routeLayer) map.removeLayer(routeLayer);
    routeLayer = drawGeoJson({ type: 'FeatureCollection', features: [routeFeature] }, { color: '#d33', weight: 4 });
    map.fitBounds(routeLayer.getBounds(), { padding: [20, 20] });
  } catch (err) {
    alert('Build failed: ' + (err && err.message ? err.message : err));
  }
});

document.getElementById('makeBuffer').addEventListener('click', async () => {
  if (!routeFeature) { alert('Build a route first'); return; }
  const miles = parseFloat(document.getElementById('bufferMiles').value || '5');
  const buffered = await makeBufferFromFeature(routeFeature, miles);
  if (bufferLayer) map.removeLayer(bufferLayer);
  bufferLayer = drawGeoJson(buffered, { color: '#228B22', weight: 2, fillOpacity: 0.15 });
  try { map.fitBounds(bufferLayer.getBounds(), { padding: [20, 20] }); } catch {}
});

document.getElementById('clearMap').addEventListener('click', clearMap);
