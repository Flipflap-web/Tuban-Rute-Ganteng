import { GeolocateControl } from 'maplibre-gl';

export function addGeolocationControl(map) {
  const geolocateControl = new GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserLocation: true,
    showAccuracyCircle: true
  });

  map.addControl(geolocateControl, 'top-right');

  return geolocateControl;
}