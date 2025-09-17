import { InitMap } from './common/InitMap.js';
import { Geocode } from './common/Geocode.js';
import { BuildRoute } from './features/route/BuildRoute.js';
import { MakeBuffer } from './features/route/MakeBuffer.js';

const { Map, L } = InitMap();

let RouteLayer = null;
let BufferLayer = null;
let RouteFeature = null;
let Clients = [];
let ClientMarkers = [];


function DrawGeoJson(FeatureCollection, Style) {
  const Layer = L.geoJSON(FeatureCollection, { style: Style });
  Layer.addTo(Map);
  return Layer;
}

function ClearMap() {
  if (RouteLayer) { Map.removeLayer(RouteLayer); RouteLayer = null; }
  if (BufferLayer) { Map.removeLayer(BufferLayer); BufferLayer = null; }
  RouteFeature = null;
}

document.getElementById('BuildRoute').addEventListener('click', async () => {
  const Origin = document.getElementById('origin').value.trim();
  const Destination = document.getElementById('destination').value.trim();
  const Stops = document.getElementById('stops').value
    .split(/\n+/).map(s => s.trim()).filter(Boolean);

  if (!Origin || !Destination) { alert('Enter origin and destination'); return; }

  try {
    const O = await Geocode(Origin);
    const D = await Geocode(Destination);
    const W = [];
    for (const S of Stops) W.push(await Geocode(S));

    const Line = await BuildRoute([O, ...W, D]);
    RouteFeature = { type: 'Feature', properties: {}, geometry: Line };

    if (RouteLayer) Map.removeLayer(RouteLayer);
    RouteLayer = DrawGeoJson({ type: 'FeatureCollection', features: [RouteFeature] }, { color: '#d33', weight: 4 });
    Map.fitBounds(RouteLayer.getBounds(), { padding: [20, 20] });
  } catch (Err) {
    alert('Build failed: ' + (Err?.message || Err));
  }
});

document.getElementById('makeBuffer').addEventListener('click', async () => {
  if (!RouteFeature) { alert('Build a route first'); return; }
  const Miles = parseFloat(document.getElementById('BufferMiles').value || '5');
  const Buffered = await MakeBuffer(RouteFeature, Miles);
  if (BufferLayer) Map.removeLayer(BufferLayer);
  BufferLayer = DrawGeoJson(Buffered, { color: '#228B22', weight: 2, fillOpacity: 0.15 });
  try { Map.fitBounds(BufferLayer.getBounds(), { padding: [20, 20] }); } catch {}
  
  // Clear old markers
  ClientMarkers.forEach(m => Map.removeLayer(m));
  ClientMarkers = [];
  
  // Filter clients inside buffer
  const matches = Clients.filter(c => c.lat && c.lng && turf.booleanPointInPolygon([c.lng, c.lat], Buffered));
  
  // Add markers for matches
  matches.forEach(c => {
    const marker = L.marker([c.lat, c.lng]).addTo(Map).bindPopup(c.org || '(no org)');
    ClientMarkers.push(marker);
  });
  
  // Update results list
  const resultsDiv = document.getElementById('ClientResults');
  resultsDiv.innerHTML = matches.map(c => `<div>${c.org}</div>`).join('');
});

document.getElementById('ClearMap').addEventListener('click', ClearMap);

import { LoadClients } from './common/CsvLoader.js';

document.getElementById('LoadClients').addEventListener('click', async () => {
  const fileInput = document.getElementById('ClientCsv');
  if (!fileInput.files.length) { alert('Please select a CSV file first'); return; }

  try {
    Clients = await LoadClients(fileInput.files[0]);
    alert(`Loaded ${Clients.length} clients`);
  } catch (err) {
    alert('Error loading CSV: ' + err.message);
  }
});

