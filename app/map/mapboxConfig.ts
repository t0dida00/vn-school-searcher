export const MAP_STYLE = "mapbox://styles/mapbox/streets-v12";
export const MAPBOX_ACCESS_TOKEN =process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
export const INITIAL_VIEWPORT = {
 center: [
    Number(process.env.NEXT_PUBLIC_MAP_LONGITUDE || 26.0),
    Number(process.env.NEXT_PUBLIC_MAP_LATITUDE || 65.0),
  ] as [number, number],
  zoom: Number(process.env.NEXT_PUBLIC_MAP_ZOOM || 4.5),
  minZoom: Number(process.env.NEXT_PUBLIC_MAP_MIN_ZOOM || 2),
  maxZoom: Number(process.env.NEXT_PUBLIC_MAP_MAX_ZOOM || 15),
};
