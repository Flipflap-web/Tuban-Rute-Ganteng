import { Popup } from 'maplibre-gl';

function escapeHtml(value) {
  return String(value ?? '-')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function addHaltePopup(map) {
  let currentPopup = null;

  map.on('click', (event) => {
    currentPopup?.remove();
    currentPopup = null;

    const features = map.queryRenderedFeatures(event.point, {
      layers: ['halte-points']
    });

    if (!features.length) {
      return;
    }

    const feature = features[0];
    const properties = feature.properties;

    const content = `
      <strong>${escapeHtml(properties.Halte)}</strong>
      <p>Rute bus: ${escapeHtml(properties.RuteBus)}</p>
      <p>Jam operasi: ${escapeHtml(properties.JamOP)}</p>
    `;

    currentPopup = new Popup({
    closeButton: true,
    closeOnClick: false,
    className: 'halte-popup'
})
      .setLngLat(feature.geometry.coordinates)
      .setHTML(content)
      .addTo(map);

    currentPopup.on('close', () => {
      currentPopup = null;
    });
  });
}