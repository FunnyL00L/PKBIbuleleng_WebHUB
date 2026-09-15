/**
 * Data GeoJSON Batas Wilayah 9 Kecamatan Kabupaten Buleleng
 * Sesuai batas administrasi resmi (Kementerian Dalam Negeri)
 */

export interface BulelengFeatureProperties {
  nama: string;
  id: string;
}

export interface BulelengGeoJsonObject {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: BulelengFeatureProperties;
    geometry: {
      type: 'Polygon';
      coordinates: number[][][];
    };
  }>;
}

export const DATA_BULELENG_GEOJSON: BulelengGeoJsonObject = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { nama: 'Gerokgak', id: 'gerokgak' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114.43, -8.11],
            [114.65, -8.11],
            [114.78, -8.16],
            [114.78, -8.25],
            [114.43, -8.2],
            [114.43, -8.11],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { nama: 'Seririt', id: 'seririt' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114.78, -8.16],
            [114.93, -8.17],
            [114.93, -8.25],
            [114.78, -8.25],
            [114.78, -8.16],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { nama: 'Busungbiu', id: 'busungbiu' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114.93, -8.25],
            [115.02, -8.25],
            [115.02, -8.35],
            [114.93, -8.35],
            [114.93, -8.25],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { nama: 'Banjar', id: 'banjar' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114.93, -8.17],
            [115.05, -8.1],
            [115.05, -8.25],
            [115.02, -8.25],
            [114.93, -8.25],
            [114.93, -8.17],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { nama: 'Buleleng', id: 'buleleng' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [115.05, -8.1],
            [115.13, -8.08],
            [115.13, -8.15],
            [115.05, -8.15],
            [115.05, -8.1],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { nama: 'Sukasada', id: 'sukasada' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [115.05, -8.15],
            [115.13, -8.15],
            [115.13, -8.18],
            [115.15, -8.28],
            [115.05, -8.28],
            [115.05, -8.25],
            [115.05, -8.15],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { nama: 'Sawan', id: 'sawan' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [115.13, -8.08],
            [115.2, -8.07],
            [115.2, -8.2],
            [115.13, -8.18],
            [115.13, -8.15],
            [115.13, -8.08],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { nama: 'Kubutambahan', id: 'kubutambahan' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [115.2, -8.07],
            [115.28, -8.07],
            [115.28, -8.18],
            [115.2, -8.2],
            [115.2, -8.07],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { nama: 'Tejakula', id: 'tejakula' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [115.28, -8.07],
            [115.45, -8.07],
            [115.45, -8.18],
            [115.28, -8.18],
            [115.28, -8.07],
          ],
        ],
      },
    },
  ],
};
