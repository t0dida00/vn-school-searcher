import type { Map } from "mapbox-gl";
// Simplified Finland outline (incl. Åland) from geoBoundaries gbOpen FIN ADM0, OpenStreetMap data, ODbL 1.0
import finland from "./finland.json";

const FONT = ["DIN Offc Pro Bold", "Arial Unicode MS Bold"];
const TEXT_SIZE = 13;
const CLUSTER_CIRCLE_COLOR = "#111827";
const CLUSTER_CIRCLE_STROKE_COLOR = "#fff";
// Warm sand tones: light enough that the dark clusters and white logo badges stand out
const OUTSIDE_COLOR = "#fbf8f4";
const SILHOUETTE_COLOR = "#e9c9a6";
const BORDER_COLOR = "#c49a72";

// The world with Finland cut out as holes. Covering the basemap with it leaves Finland as the only
// thing drawn, at every zoom level, without needing a custom Mapbox style.
const WORLD_RING = [[-180, -85], [180, -85], [180, 85], [-180, 85], [-180, -85]];
const outsideFinland: GeoJSON.Feature<GeoJSON.Polygon> = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [WORLD_RING, ...finland.geometry.coordinates.map((polygon) => polygon[0])],
  },
};

export function addFinlandLayers(map: Map) {
  map.addSource("finland", { type: "geojson", data: finland as GeoJSON.Feature<GeoJSON.MultiPolygon> });
  map.addSource("outside-finland", { type: "geojson", data: outsideFinland });

  // Opaque mask above every basemap layer, labels included; the school layers are added after it
  map.addLayer({
    id: "outside-finland",
    type: "fill",
    source: "outside-finland",
    paint: { "fill-color": OUTSIDE_COLOR, "fill-opacity": 1, "fill-antialias": false },
  });

  // Grey silhouette at country scale, fading out so streets show once the user zooms in
  map.addLayer({
    id: "finland-silhouette",
    type: "fill",
    source: "finland",
    paint: {
      "fill-color": SILHOUETTE_COLOR,
      // Fully opaque at country scale: any see-through shows tiles as they load, in patchy bands
      "fill-opacity": ["interpolate", ["linear"], ["zoom"], 6, 1, 8, 0],
    },
  });

  map.addLayer({
    id: "finland-border",
    type: "line",
    source: "finland",
    paint: {
      "line-color": BORDER_COLOR,
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 10, 1.5],
    },
  });
}

export function addUniversityLayers(map: Map, geojsonData: GeoJSON.FeatureCollection) {
  map.addSource("universities", {
    type: "geojson",
    data: geojsonData,
    cluster: true,
    // Logo markers are ~44px wide, so keep clustering until schools are far enough apart
    clusterMaxZoom: 11,
    clusterRadius: 48,
  });

  // Individual schools are HTML logo markers (see markers.ts); only clusters are drawn as layers
  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "universities",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": CLUSTER_CIRCLE_COLOR,
      "circle-radius": ["step", ["get", "point_count"], 16, 5, 20, 10, 24],
      "circle-stroke-width": 3,
      "circle-stroke-color": CLUSTER_CIRCLE_STROKE_COLOR,
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "universities",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": FONT,
      "text-size": TEXT_SIZE,
      "text-allow-overlap": true,
    },
    paint: {
      "text-color": "#fff",
    },
  });
}
