"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { cn } from "@/lib/utils";
import { MAPBOX_ACCESS_TOKEN } from "../map/mapboxConfig";
import { COUNTRY_MAPS } from "../map/countryMaps";
import { addFlagClusterLayers } from "../map/layerConfig";
import { createLogoMarkerElement } from "../map/markers";
import { COUNTRIES, countryPath, type CountryCode } from "../lib/countries";
import { parentIdOf, toMapFeatures } from "../utils/campuses";
import { rankOf } from "../utils/ranking";

export type GlobeCountry = { code: CountryCode; schools: any[] };

const STYLE = "mapbox://styles/mapbox/light-v11";

// Every supported country's schools on one globe. Each country gets its own clustered source, so its
// clusters show its flag (layerConfig.ts); single schools are the same logo pins as the country maps.
export default function GlobeMap({ countries, className }: { countries: GlobeCountry[]; className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;
        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
        const map = new mapboxgl.Map({
            container: containerRef.current,
            style: STYLE,
            projection: "globe",
            center: [62, 38],
            zoom: window.innerWidth < 576 ? 0.6 : 1.3,
            minZoom: 0.5,
            maxZoom: 14,
            // The page scrolls past the globe; only drag/pinch/buttons move it
            scrollZoom: false,
            attributionControl: true,
        });
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
        // Start downloading the outlines now, in parallel with the style and tiles
        const outlines = Promise.all(countries.map(({ code }) => COUNTRY_MAPS[code].loadOutline()));
        let removed = false;

        map.on("style.load", () => {
            map.setFog({ color: "#f8fafc", "high-color": "#cfe3f5", "horizon-blend": 0.06, "space-color": "#0b1026", "star-intensity": 0.25 });
        });

        map.on("load", () => {
            for (const { code, schools } of countries) {
                const flag = COUNTRY_MAPS[code].flag;
                const source = `schools-${code}`;
                const suffix = `-${code}`;
                map.addSource(source, {
                    type: "geojson",
                    data: { type: "FeatureCollection", features: toMapFeatures(schools) },
                    cluster: true,
                    clusterMaxZoom: 10,
                    clusterRadius: 44,
                });
                addFlagClusterLayers(map, source, flag, suffix, true);

                // Clusters zoom in; logo pins (below) open a popup with links into the country's pages
                map.on("click", `clusters${suffix}`, (e) => {
                    const feature = e.features?.[0];
                    if (!feature) return;
                    (map.getSource(source) as mapboxgl.GeoJSONSource).getClusterExpansionZoom(feature.properties?.cluster_id, (err, zoom) => {
                        if (err || zoom == null) return;
                        map.easeTo({ center: (feature.geometry as GeoJSON.Point).coordinates as [number, number], zoom });
                    });
                });
                map.on("mouseenter", `clusters${suffix}`, () => (map.getCanvas().style.cursor = "pointer"));
                map.on("mouseleave", `clusters${suffix}`, () => (map.getCanvas().style.cursor = ""));
            }
            map.on("render", syncMarkers);
            // Highlight the countries that have data, in their flag colour, under the pins and clusters
            outlines.then((features) => {
                if (removed) return;
                countries.forEach(({ code }, i) => {
                    const color = COUNTRIES[code].hero.background;
                    const source = `country-${code}`;
                    const below = `clusters-${code}`;
                    map.addSource(source, { type: "geojson", data: features[i] });
                    map.addLayer(
                        {
                            id: `country-fill-${code}`,
                            type: "fill",
                            source,
                            // Strong at globe scale, fading so streets show once zoomed in
                            paint: { "fill-color": color, "fill-opacity": ["interpolate", ["linear"], ["zoom"], 1, 0.85, 6, 0.15] },
                        },
                        below
                    );
                    // Soft glow around the border: at globe scale a country is about as big as its flag
                    // badge, so the glow is what shows past the badge
                    map.addLayer(
                        {
                            id: `country-glow-${code}`,
                            type: "line",
                            source,
                            paint: {
                                "line-color": color,
                                "line-width": ["interpolate", ["linear"], ["zoom"], 1, 14, 6, 4],
                                "line-blur": ["interpolate", ["linear"], ["zoom"], 1, 10, 6, 3],
                                "line-opacity": ["interpolate", ["linear"], ["zoom"], 1, 0.55, 6, 0.2],
                            },
                        },
                        below
                    );
                    map.addLayer(
                        {
                            id: `country-line-${code}`,
                            type: "line",
                            source,
                            paint: { "line-color": color, "line-width": ["interpolate", ["linear"], ["zoom"], 1, 0.8, 6, 2] },
                        },
                        below
                    );
                    // Clicking the country itself (not a pin or cluster) zooms to it
                    map.on("click", `country-fill-${code}`, (e) => {
                        const hits = map.queryRenderedFeatures(e.point, { layers: [`clusters-${code}`] });
                        if (hits.length) return;
                        map.fitBounds(COUNTRY_MAPS[code].bounds, { padding: 40, duration: 1200 });
                    });
                    map.on("mouseenter", `country-fill-${code}`, () => (map.getCanvas().style.cursor = "pointer"));
                    map.on("mouseleave", `country-fill-${code}`, () => (map.getCanvas().style.cursor = ""));
                });
                map.once("idle", () => setReady(true));
            });
        });

        // Logo pins for unclustered schools, like markers.ts does for the country maps: kept in step with
        // clustering on every render, keyed by "<country>:<feature id>"
        const markers = new Map<string, mapboxgl.Marker>();
        const syncMarkers = () => {
            const visible = new Set<string>();
            for (const { code, schools } of countries) {
                const source = `schools-${code}`;
                if (!map.getSource(source) || !map.isSourceLoaded(source)) continue;
                for (const feature of map.querySourceFeatures(source, { filter: ["!", ["has", "point_count"]] })) {
                    const featureId = String(feature.properties?.id ?? "");
                    const key = `${code}:${featureId}`;
                    if (!featureId || visible.has(key)) continue;
                    visible.add(key);
                    if (markers.has(key)) continue;
                    const parentId = parentIdOf(featureId);
                    const school = schools.find((s) => s.properties?.id === parentId);
                    if (!school) continue;
                    const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
                    const campus = parentId !== featureId ? { name: String(feature.properties?.campus ?? ""), coordinates } : undefined;
                    const element = createLogoMarkerElement(school, campus, () =>
                        new mapboxgl.Popup({ offset: [0, -48], maxWidth: "260px" })
                            .setLngLat(coordinates)
                            .setDOMContent(popupContent(code, school, campus?.name))
                            .addTo(map)
                    );
                    markers.set(key, new mapboxgl.Marker({ element, anchor: "bottom" }).setLngLat(coordinates).addTo(map));
                }
            }
            for (const [key, marker] of markers) {
                if (!visible.has(key)) {
                    marker.remove();
                    markers.delete(key);
                }
            }
        };

        // The /countries layout can expand the globe across the row; keep the canvas sized to its box
        const observer = new ResizeObserver(() => map.resize());
        observer.observe(containerRef.current);

        // Reveal anyway if a tile keeps failing
        const fallback = setTimeout(() => setReady(true), 10000);
        return () => {
            clearTimeout(fallback);
            observer.disconnect();
            removed = true;
            map.remove();
        };
        // Created once; the server passes the data in with the page
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cn("relative overflow-hidden bg-[#0b1026]", className)}>
            <div ref={containerRef} className={cn("size-full transition-opacity duration-500", ready ? "opacity-100" : "opacity-0")} />
            {!ready && <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_50%_55%,#1e3a5f_0%,#0b1026_60%)]" aria-hidden />}
        </div>
    );
}

// Built from DOM nodes (not an HTML string) so school names can't inject markup
function popupContent(code: CountryCode, school: any, campus?: string) {
    const { id, name, city, logo } = school.properties;
    const el = (tag: string, className: string, text?: string) => {
        const node = document.createElement(tag);
        node.className = className;
        if (text) node.textContent = text;
        return node;
    };

    const root = el("div", "flex flex-col gap-2 p-1 font-sans");
    const head = el("div", "flex items-center gap-2");
    if (logo) {
        const img = document.createElement("img");
        img.src = logo;
        img.alt = "";
        img.className = "size-9 shrink-0 rounded-md border bg-white object-contain p-0.5";
        img.onerror = () => img.remove();
        head.append(img);
    }
    const text = el("div", "min-w-0");
    const title = el("div", "text-sm font-semibold leading-snug", name);
    const rank = rankOf(school);
    if (rank) title.append(el("span", "ml-1.5 rounded bg-amber-100 px-1 text-xs font-semibold text-amber-900", `#${rank}`));
    text.append(title, el("div", "text-xs text-gray-500", campus ? `${campus} · ${COUNTRIES[code].name}` : `${city}, ${COUNTRIES[code].name}`));
    head.append(text);
    root.append(head);

    const links = el("div", "flex gap-2");
    const link = (href: string, label: string, primary: boolean) => {
        const a = el("a", primary ? "rounded-md bg-gray-900 px-2.5 py-1 text-xs font-medium text-white" : "rounded-md border px-2.5 py-1 text-xs font-medium text-gray-900", label) as HTMLAnchorElement;
        a.href = href;
        return a;
    };
    links.append(link(countryPath(code, `/school/${encodeURIComponent(id)}`), "View school", true));
    if (COUNTRIES[code].hasMap) links.append(link(countryPath(code, `/map?school=${encodeURIComponent(id)}`), "Open map", false));
    root.append(links);
    return root;
}
