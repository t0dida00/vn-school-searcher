import type { LngLatBoundsLike, Map, PaddingOptions } from "mapbox-gl";
import { FINLAND_BOUNDS, INITIAL_VIEWPORT } from "./mapboxConfig";

// Keep Finland clear of the floating search panel (see MapSearch.tsx): a 360px column on the left
// from 576px up, a search bar across the top below that. On phones the bottom also leaves room for
// the "List view" button (Map.tsx), which would otherwise sit on the south coast.
function fitPadding(): Required<PaddingOptions> {
    return window.innerWidth >= 576
        ? { top: 24, bottom: 24, left: 392, right: 24 }
        : { top: 140, bottom: 72, left: 16, right: 16 };
}

// Fits Finland to the screen and pins the camera there: the user can zoom in and pan, but never
// zoom out past this view or pan Finland off screen.
export function lockToFinland(map: Map) {
    // Mapbox clears the limit for null; its typings just don't say so
    map.setMaxBounds(null as unknown as LngLatBoundsLike);
    map.setMinZoom(INITIAL_VIEWPORT.minZoom);
    // Not fitBounds: it leaves its padding on the map, and getBounds() then returns only the padded
    // inner box. Pinning maxBounds to that box made Mapbox zoom in and crop Finland.
    map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 });
    const padding = fitPadding();
    const camera = map.cameraForBounds(FINLAND_BOUNDS, { padding });
    if (!camera) return;
    map.jumpTo(camera);
    // cameraForBounds sizes the zoom for the padded box but still centres on the bounds, so with
    // uneven padding Finland would sit under the panel (iPad, landscape phones). Shift it into the box.
    const container = map.getContainer();
    map.jumpTo({
        center: map.unproject([
            container.clientWidth / 2 - (padding.left - padding.right) / 2,
            container.clientHeight / 2 - (padding.top - padding.bottom) / 2,
        ]),
    });
    map.setMinZoom(map.getZoom());
    const fitted = map.getBounds();
    if (fitted) map.setMaxBounds(fitted);
}

// On a resize (rotation, mobile URL bar, window drag) re-fit if the user was looking at the whole
// country, so Finland can't end up cropped. If they had zoomed in, leave their view alone.
export function keepFinlandLocked(map: Map) {
    let atOverview = true;
    map.on("zoomend", () => {
        atOverview = map.getZoom() <= map.getMinZoom() + 0.05;
    });
    map.on("resize", () => {
        if (atOverview) lockToFinland(map);
    });
}
