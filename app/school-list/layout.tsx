// app/school-list/layout.tsx
import React from "react";
import Header from "./components/Header";

export default function SchoolListLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <div className=" min-h-screen">
                {children}
            </div>
        </>
    );
}
