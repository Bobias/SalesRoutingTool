import L from 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet-src.esm.js';

export function initMap() {
  const map = L.map('map').setView([39.5, -105.5], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);
  return { map, L };
}
