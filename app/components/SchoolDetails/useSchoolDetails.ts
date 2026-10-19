"use client";
import { useEffect, useState } from "react";
import { campusesOf, campusView } from "@/app/utils/campuses";
import { schoolId } from "@/app/utils/schoolId";
import { useCountry } from "@/app/utils/useCountry";

// Full documents fetched this session, by "<country>:<id>"; a failed request is dropped so Retry can refetch
const cache = new Map<string, Promise<any>>();

function fetchDetails(country: string, id: string) {
    const key = `${country}:${id}`;
    let request = cache.get(key);
    if (!request) {
        request = fetch(`/api/universities/${encodeURIComponent(id)}?country=${country}`).then((res) => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        });
        request.catch(() => cache.delete(key));
        cache.set(key, request);
    }
    return request;
}

// The map only has slim GeoJSON (no overview, contacts, addresses, ...), so its dialog loads the rest here.
// Schools that already carry their full document (the university list's) are returned as they are.
// Opened from a campus pin, the details are shown as seen from that campus, like the slim selection was.
export function useSchoolDetails(selected: any) {
    const country = useCountry();
    const id = selected ? schoolId(selected) : null;
    const complete = selected?.properties?.overview !== undefined;
    const [state, setState] = useState<{ id: string | null; full: any; error: string | null }>({ id: null, full: null, error: null });
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!id || complete) return;
        let cancelled = false;
        setState({ id, full: null, error: null });
        fetchDetails(country, id)
            .then((full) => !cancelled && setState({ id, full, error: null }))
            .catch((error) => !cancelled && setState({ id, full: null, error: error?.message || "Couldn't load details" }));
        return () => {
            cancelled = true;
        };
    }, [country, id, complete, attempt]);

    if (!selected || complete) return { school: selected, loading: false, error: null, retry: () => {} };
    const full = state.id === id ? state.full : null;
    const campusName = selected.properties?.campus;
    const campus = full && campusName ? campusesOf(full).find((c) => c.name === campusName) : null;
    return {
        school: full ? (campus ? campusView(full, campus) : full) : null,
        loading: !full && !(state.id === id && state.error),
        error: state.id === id ? state.error : null,
        retry: () => setAttempt((n) => n + 1),
    };
}
