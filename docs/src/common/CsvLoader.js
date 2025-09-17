import { Geocode } from './Geocode.js';

// Wrapper around PapaParse (Papa is included via <script> in index.html)
function ParseCsv(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => resolve(results.data),
      error: err => reject(err)
    });
  });
}

export async function LoadClients(file) {
  const rows = await ParseCsv(file);
  const clients = [];

  for (const row of rows) {
    const address = `${row['Address'] || ''}, ${row['City'] || ''}, ${row['State'] || ''} ${row['Zip Code'] || ''}`;

    const client = {
      org: row['Organization Name'] || '',
      address,
      raw: row,
      lat: null,
      lng: null
    };

    try {
      const loc = await Geocode(address);
      client.lat = loc.lat;
      client.lng = loc.lng;
    } catch (e) {
      console.warn('Geocode failed for', address);
    }

    clients.push(client);
  }

  return clients;
}

