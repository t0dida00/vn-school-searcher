import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// /privacy and /disclaimer: site-wide pages, linked from the footer (the same Footer as every page)
export default function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <div className="min-h-screen">{children}</div>
            <Footer />
        </>
    );
}
