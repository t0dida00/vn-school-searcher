import type { Map } from "mapbox-gl";
import type { CountryMap } from "./countryMaps";

const FONT = ["DIN Offc Pro Bold", "Arial Unicode MS Bold"];
const TEXT_SIZE = 13;
const CLUSTER_CIRCLE_STROKE_COLOR = "#fff";
// Clusters are round flags of the country with the count on top
const FLAG_IMAGE = "country-flag";
// Drawn at 2× so it stays sharp on retina; 64px at pixelRatio 2 = a 32px badge = the smallest cluster
const FLAG_SIZE = 64;
// Warm sand tones: light enough that the clusters and white logo badges stand out
const OUTSIDE_COLOR = "#fbf8f4";
const SILHOUETTE_COLOR = "#e9c9a6";
const BORDER_COLOR = "#c49a72";

// The world with the country cut out as holes. Covering the basemap with it leaves the country as the
// only thing drawn, at every zoom level, without needing a custom Mapbox style.
const WORLD_RING = [[-180, -85], [180, -85], [180, 85], [-180, 85], [-180, -85]];

export function addCountryLayers(map: Map, outline: GeoJSON.Feature<GeoJSON.MultiPolygon>) {
  const outside: GeoJSON.Feature<GeoJSON.Polygon> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [WORLD_RING, ...outline.geometry.coordinates.map((polygon) => polygon[0])],
    },
  };
  map.addSource("country", { type: "geojson", data: outline });
  map.addSource("outside-country", { type: "geojson", data: outside });

  // Opaque mask above every basemap layer, labels included; the school layers are added after it
  map.addLayer({
    id: "outside-country",
    type: "fill",
    source: "outside-country",
    paint: { "fill-color": OUTSIDE_COLOR, "fill-opacity": 1, "fill-antialias": false },
  });

  // Sand silhouette at country scale, fading out so streets show once the user zooms in
  map.addLayer({
    id: "country-silhouette",
    type: "fill",
    source: "country",
    paint: {
      "fill-color": SILHOUETTE_COLOR,
      // Fully opaque at country scale: any see-through shows tiles as they load, in patchy bands
      "fill-opacity": ["interpolate", ["linear"], ["zoom"], 6, 1, 8, 0],
    },
  });

  map.addLayer({
    id: "country-border",
    type: "line",
    source: "country",
    paint: {
      "line-color": BORDER_COLOR,
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 10, 1.5],
    },
  });
}

// Round crop of the flag, for cluster badges
export function flagImage(draw: CountryMap["flag"]["draw"]) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = FLAG_SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.beginPath();
  ctx.arc(FLAG_SIZE / 2, FLAG_SIZE / 2, FLAG_SIZE / 2, 0, Math.PI * 2);
  ctx.clip();
  draw(ctx, FLAG_SIZE);
  return ctx.getImageData(0, 0, FLAG_SIZE, FLAG_SIZE);
}

// Clusters drawn as round flags of the country with the count on top: the circle is the white ring and
// the click target, the flag icon covers its fill. `suffix` keeps layer/image ids unique when one map
// has several countries (the globe); the country maps use "" → "clusters", "cluster-flag", "cluster-count".
// `globe` shrinks the badges when zoomed out (a country is about badge-sized there, so it stays visible
// around it) and rings them in the flag's dark colour against the pale globe.
export function addFlagClusterLayers(map: Map, source: string, flag: CountryMap["flag"], suffix = "", globe = false) {
  const image = `${FLAG_IMAGE}${suffix}`;
  // Badge radius 16/20/24px by school count (5+, 10+); the flag image is 16px in radius
  const radius = (scale: number) => ["step", ["get", "point_count"], 16 * scale, 5, 20 * scale, 10, 24 * scale];
  const iconSize = (scale: number) => ["step", ["get", "point_count"], scale, 5, 1.25 * scale, 10, 1.5 * scale];
  const byZoom = (size: (scale: number) => unknown[]) =>
    globe ? ["interpolate", ["linear"], ["zoom"], 1, size(0.6), 4, size(1)] : size(1);
  if (!map.hasImage(image)) map.addImage(image, flagImage(flag.draw), { pixelRatio: 2 });

  map.addLayer({
    id: `clusters${suffix}`,
    type: "circle",
    source,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": "#fff",
      "circle-radius": byZoom(radius) as any,
      "circle-stroke-width": globe ? 2 : 3,
      "circle-stroke-color": globe ? flag.halo : CLUSTER_CIRCLE_STROKE_COLOR,
    },
  });

  map.addLayer({
    id: `cluster-flag${suffix}`,
    type: "symbol",
    source,
    filter: ["has", "point_count"],
    layout: {
      "icon-image": image,
      // Matches the circle radii above
      "icon-size": byZoom(iconSize) as any,
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
    },
  });

  map.addLayer({
    id: `cluster-count${suffix}`,
    type: "symbol",
    source,
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": FONT,
      "text-size": TEXT_SIZE,
      "text-allow-overlap": true,
    },
    paint: {
      "text-color": "#fff",
      // Dark halo in the flag's colour keeps the count readable over its light parts (white, yellow)
      "text-halo-color": flag.halo,
      "text-halo-width": 2,
    },
  });
}

export function addUniversityLayers(map: Map, geojsonData: GeoJSON.FeatureCollection, flag: CountryMap["flag"]) {
  map.addSource("universities", {
    type: "geojson",
    data: geojsonData,
    cluster: true,
    // Logo markers are ~44px wide, so keep clustering until schools are far enough apart
    clusterMaxZoom: 11,
    clusterRadius: 48,
  });

  // Individual schools are HTML logo markers (see markers.ts); only clusters are drawn as layers
  addFlagClusterLayers(map, "universities", flag);
}
