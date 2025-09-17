import * as L from 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet-src.esm.js';

export function InitMap() {
  const Map = L.map('map'); // keep defaults

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    keepBuffer: 3,          // keeps a ring of tiles to avoid edge gaps during pan
    updateWhenIdle: true,   // draw when settled (reduces mid-zoom seams)
    crossOrigin: true
  }).addTo(Map);

  Map.setView([39.5, -105.5], 7);

  // Make sure Leaflet recalculates after our grid/panel layout renders
  setTimeout(() => Map.invalidateSize(), 0);
  window.addEventListener('resize', () => Map.invalidateSize());

  return { Map, L };
}
