import { buffer } from '@turf/buffer';

export function createHalteBuffer(halteData) {
  return buffer(halteData, 300, {
    units: 'meters'
  });
}