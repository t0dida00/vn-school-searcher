export const MAP_STYLE = "mapbox://styles/mapbox/streets-v12";
export const MAPBOX_ACCESS_TOKEN =process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
export const INITIAL_VIEWPORT = {
  center: [108.20623, 16.047079] as [number, number], // Centered on Vietnam
  zoom: 5.5,
maxZoom: 15,
    minZoom: 2,
};
