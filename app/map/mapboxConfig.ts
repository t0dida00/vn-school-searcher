export const MAP_STYLE = "mapbox://styles/mapbox/streets-v12";
export const MAPBOX_ACCESS_TOKEN =process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
export const INITIAL_VIEWPORT = {
  minZoom: Number(process.env.NEXT_PUBLIC_MAP_MIN_ZOOM || 2),
  maxZoom: Number(process.env.NEXT_PUBLIC_MAP_MAX_ZOOM || 15),
};

// Country bounds live in countryMaps.ts
