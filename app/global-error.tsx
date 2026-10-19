"use client";
import { useEffect, useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY, isCountry } from "./lib/countries";

// Only shown if the root layout itself fails, so it can't rely on layout.tsx (fonts, globals.css)
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    // The brand of the country in the URL (VieUnies on /vn/...); read after mount since this replaces
    // the root layout and may first render on the server
    const [brand, setBrand] = useState<string>(COUNTRIES[DEFAULT_COUNTRY].brand);
    useEffect(() => {
        const first = window.location.pathname.split("/")[1];
        if (isCountry(first)) setBrand(COUNTRIES[first].brand);
    }, []);

    return (
        <html lang="en">
            <body
                style={{
                    margin: 0,
                    minHeight: "100dvh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 16,
                    fontFamily: "system-ui, sans-serif",
                    textAlign: "center",
                    color: "#111827",
                    background: "#fff",
                }}
            >
                <div style={{ maxWidth: 420 }}>
                    <h1 style={{ fontSize: 28, margin: "0 0 8px" }}>Something went wrong</h1>
                    <p style={{ color: "#6b7280", margin: "0 0 24px" }}>
                        {brand} couldn&apos;t load right now. Please try again in a moment.
                    </p>
                    <button
                        type="button"
                        onClick={reset}
                        style={{ padding: "10px 18px", borderRadius: 8, border: 0, background: "#111827", color: "#fff", fontSize: 14, cursor: "pointer" }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
