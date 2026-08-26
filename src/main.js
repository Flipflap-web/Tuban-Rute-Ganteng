import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { createHalteBuffer } from './bufferhalte.js';
import halteData from './data/Halte.json';
import jalanData from './data/jaringan-jalan.json';

const mapLayout = document.createElement('div');
mapLayout.id = 'map-layout';

const sidePanel = document.createElement('aside');
sidePanel.id = 'side-panel';
sidePanel.innerHTML = `
  <section>
    <h2>Layer Peta</h2>

    <label>
      <input type="checkbox" data-layer="halte" checked>
      Halte
    </label>

    <label>
      <input type="checkbox" data-layer="jaringan-jalan" checked>
      Jaringan Jalan
    </label>
  </section>

  <section>
    <h2>Buffer Halte</h2>

    <label>
      <input type="checkbox" data-layer="halte-buffer">
      Buffer 300 meter
    </label>
  </section>
`;

const mapElement = document.createElement('div');
mapElement.id = 'map';

mapLayout.appendChild(sidePanel);
mapLayout.appendChild(mapElement);
document.body.appendChild(mapLayout);

const mapStatus = document.createElement('div');
mapStatus.className = 'map-status';
mapStatus.setAttribute('role', 'status');
mapStatus.textContent = 'Memuat data peta…';
mapElement.appendChild(mapStatus);

function escapeHtml(value) {
  return String(value ?? '-')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

const map = L.map(mapElement).setView([-6.8928125, 112.0432747], 12);

L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    attribution: 'Tiles © Esri',
    maxZoom: 19
  }
).addTo(map);

const jalanLayer = L.geoJSON(jalanData, {
  style: {
    color: '#eeeeee',
    weight: 2,
    opacity: 0.9
  }
}).addTo(map);

const halteLayer = L.geoJSON(halteData, {
  pointToLayer: (_feature, latLng) => L.circleMarker(latLng, {
    radius: 8,
    fillColor: '#ff0000',
    fillOpacity: 1,
    color: '#ffffff',
    weight: 2
  }),
  onEachFeature: (feature, layer) => {
    const properties = feature.properties ?? {};
    layer.bindPopup(`
      <strong>${escapeHtml(properties.Halte)}</strong>
      <p>Rute bus: ${escapeHtml(properties.RuteBus)}</p>
      <p>Jam operasi: ${escapeHtml(properties.JamOP)}</p>
    `, {
      className: 'halte-popup'
    });
  }
}).addTo(map);

const bufferLayer = L.geoJSON(createHalteBuffer(halteData), {
  style: {
    color: '#ffff00',
    weight: 1,
    fillColor: '#ffff00',
    fillOpacity: 0.4
  }
});

const selectableLayers = {
  halte: halteLayer,
  'jaringan-jalan': jalanLayer,
  'halte-buffer': bufferLayer
};

sidePanel.querySelectorAll('input[data-layer]').forEach((toggle) => {
  toggle.addEventListener('change', () => {
    const layer = selectableLayers[toggle.dataset.layer];

    if (toggle.checked) {
      layer.addTo(map);
    } else {
      map.removeLayer(layer);
    }
  });
});

const LocateControl = L.Control.extend({
  options: {
    position: 'topright'
  },

  onAdd() {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control-locate');
    const button = L.DomUtil.create('button', '', container);
    button.type = 'button';
    button.title = 'Tampilkan lokasi saya';
    button.setAttribute('aria-label', 'Tampilkan lokasi saya');
    button.textContent = '⌖';

    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.on(button, 'click', () => {
      map.locate({
        enableHighAccuracy: true,
        setView: true,
        maxZoom: 15
      });
    });

    return container;
  }
});

new LocateControl().addTo(map);

let locationMarker;
let accuracyCircle;

map.on('locationfound', (event) => {
  locationMarker?.remove();
  accuracyCircle?.remove();

  locationMarker = L.circleMarker(event.latlng, {
    radius: 7,
    fillColor: '#1478ff',
    fillOpacity: 1,
    color: '#ffffff',
    weight: 2
  }).addTo(map);

  accuracyCircle = L.circle(event.latlng, {
    radius: event.accuracy,
    color: '#1478ff',
    fillColor: '#1478ff',
    fillOpacity: 0.12,
    weight: 1
  }).addTo(map);
});

map.on('locationerror', () => {
  mapStatus.classList.add('map-status--error');
  mapStatus.textContent = 'Lokasi tidak dapat diakses. Periksa izin lokasi browser.';
});

mapStatus.remove();
requestAnimationFrame(() => map.invalidateSize());
