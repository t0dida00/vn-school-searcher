import type { Map } from "mapbox-gl";

const FONT = ["DIN Offc Pro Medium", "Arial Unicode MS Bold"];
const TEXT_SIZE = 12;
const CLUSTER_CIRCLE_COLOR = "#51bbd6";
const CLUSTER_CIRCLE_STROKE_COLOR = "#fff";

export function addCountryHighlightLayer(map: Map) {
  map.addSource("country-boundaries", {
    type: "vector",
    url: "mapbox://mapbox.country-boundaries-v1",
  });

  const layers = map.getStyle().layers;
  const labelLayerId = layers?.find(
    (layer) => layer.type === "symbol" && layer.layout?.["text-field"]
  )?.id;

  map.addLayer(
  {
    id: "highlight-vietnam",
    type: "fill",
    source: "country-boundaries",
    "source-layer": "country_boundaries",
    paint: {
      "fill-color": "#d2361e",
      "fill-opacity": [
        "step",
        ["zoom"],
        0.1,  // opacity for zoom < 20
        7,
        0      // opacity for zoom >= 20
      ],
    },
    filter: ["==", ["get", "iso_3166_1_alpha_3"], "VNM"],
  },
  labelLayerId
);
}

export function addUniversityLayers(map: Map, geojsonData: GeoJSON.FeatureCollection) {

  map.addSource("universities", {
    type: "geojson",
    data: geojsonData,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "universities",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": CLUSTER_CIRCLE_COLOR,
      "circle-radius": [
        "step",
        ["get", "point_count"],
        15,
        10,
        20,
        30,
        25,
      ],
      "circle-stroke-width": 1,
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
    },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "universities",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": [
        "match",
        ["get", "type"],
        "university", "#f28cb1",
        "highschool", "#4264fb",
        "#ccc",
      ],
      "circle-radius": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      14, // bigger size when selected
      8,  // normal size
    ],
      "circle-stroke-width": 1,
    },
  });

  map.addLayer({
    id: "unclustered-point-label",
    type: "symbol",
    source: "universities",
    filter: ["!", ["has", "point_count"]],
    layout: {
      "text-field": ["get", "name"],
      "text-font": FONT,
      "text-size": TEXT_SIZE,
      "text-offset": [0, 1.2],
      "text-anchor": "top",
    },
    paint: {
      "text-color": "#ff0000",
    //   "text-halo-color": TEXT_HALO_COLOR,
    //   "text-halo-width": TEXT_HALO_WIDTH,
    },
  });
}
