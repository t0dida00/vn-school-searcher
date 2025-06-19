// app/school-list/layout.tsx
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function SchoolListLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <div className=" min-h-screen">
                {children}
            </div>
            <Footer />
        </>
    );
}
