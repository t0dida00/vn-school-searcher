import type { Map } from "mapbox-gl";
// Simplified Finland outline (incl. Åland) from geoBoundaries gbOpen FIN ADM0, OpenStreetMap data, ODbL 1.0
import finland from "./finland.json";

const FONT = ["DIN Offc Pro Bold", "Arial Unicode MS Bold"];
const TEXT_SIZE = 13;
const CLUSTER_CIRCLE_STROKE_COLOR = "#fff";
// Finnish flag blue; clusters are round flags with the count on top
const FLAG_BLUE = "#002f6c";
const FLAG_IMAGE = "finland-flag";
// Drawn at 2× so it stays sharp on retina; 64px at pixelRatio 2 = a 32px badge = the smallest cluster
const FLAG_SIZE = 64;
// Warm sand tones: light enough that the clusters and white logo badges stand out
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

// A round crop of the Finnish flag (18:11, cross 3 units wide, vertical bar from 5 to 8), shifted so
// the vertical bar sits a little left of centre like on the real flag
function flagImage() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = FLAG_SIZE;
  const ctx = canvas.getContext("2d")!;
  const unit = FLAG_SIZE / 11;
  ctx.beginPath();
  ctx.arc(FLAG_SIZE / 2, FLAG_SIZE / 2, FLAG_SIZE / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, FLAG_SIZE, FLAG_SIZE);
  ctx.fillStyle = FLAG_BLUE;
  const barLeft = FLAG_SIZE * 0.4 - 1.5 * unit;
  ctx.fillRect(barLeft, 0, 3 * unit, FLAG_SIZE);
  ctx.fillRect(0, 4 * unit, FLAG_SIZE, 3 * unit);
  return ctx.getImageData(0, 0, FLAG_SIZE, FLAG_SIZE);
}

export function addUniversityLayers(map: Map, geojsonData: GeoJSON.FeatureCollection) {
  if (!map.hasImage(FLAG_IMAGE)) map.addImage(FLAG_IMAGE, flagImage(), { pixelRatio: 2 });

  map.addSource("universities", {
    type: "geojson",
    data: geojsonData,
    cluster: true,
    // Logo markers are ~44px wide, so keep clustering until schools are far enough apart
    clusterMaxZoom: 11,
    clusterRadius: 48,
  });

  // Individual schools are HTML logo markers (see markers.ts); only clusters are drawn as layers.
  // The circle is the white ring and the click target (events.ts); the flag icon covers its fill.
  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "universities",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": "#fff",
      "circle-radius": ["step", ["get", "point_count"], 16, 5, 20, 10, 24],
      "circle-stroke-width": 3,
      "circle-stroke-color": CLUSTER_CIRCLE_STROKE_COLOR,
    },
  });

  map.addLayer({
    id: "cluster-flag",
    type: "symbol",
    source: "universities",
    filter: ["has", "point_count"],
    layout: {
      "icon-image": FLAG_IMAGE,
      // Matches the circle radii above: 16/20/24px against the 16px-radius image
      "icon-size": ["step", ["get", "point_count"], 1, 5, 1.25, 10, 1.5],
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
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
      // Blue halo keeps the count readable where it crosses the flag's white fields
      "text-halo-color": FLAG_BLUE,
      "text-halo-width": 2,
    },
  });
}
