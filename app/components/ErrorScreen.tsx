import React from "react";
import Header from "./Header";
import Footer from "./Footer";

/** Full-page message shared by not-found.tsx and error.tsx; they replace the route layouts, so this brings its own Header/Footer */
export default function ErrorScreen({
    code,
    icon,
    title,
    message,
    children,
}: {
    code?: string;
    icon: React.ReactNode;
    title: string;
    message: React.ReactNode;
    children?: React.ReactNode;
}) {
    return (
        <div className="flex min-h-dvh flex-col">
            <Header />
            <main className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="flex max-w-md flex-col items-center text-center">
                    <div className="relative mb-6">
                        {code && (
                            <span
                                aria-hidden
                                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-8xl font-black tracking-tighter text-muted/70 sm:text-9xl"
                            >
                                {code}
                            </span>
                        )}
                        <div className="relative flex size-16 items-center justify-center rounded-2xl border bg-background shadow-sm [&_svg]:size-7">
                            {icon}
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
                    <p className="mt-2 text-muted-foreground">{message}</p>
                    {children && <div className="mt-6 flex w-full flex-col gap-2 min-[360px]:w-auto min-[360px]:flex-row">{children}</div>}
                </div>
            </main>
            <Footer />
        </div>
    );
}
