// app/map/layout.tsx
import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function MapLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-dvh flex-col">
            <Header fullWidth />
            <div className="relative min-h-0 flex-1">
                {children}
            </div>
            {/* Just the bottom row, so the map keeps the screen */}
            <Footer compact />
        </div>
    );
}
