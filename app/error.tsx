"use client";
import { useEffect } from "react";
import Link from "next/link";
import { CloudOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ErrorScreen from "./components/ErrorScreen";
import { useCountryPath } from "./utils/useCountry";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const path = useCountryPath();
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <ErrorScreen
            icon={<CloudOff />}
            title="Something went wrong"
            message={
                <>
                    This page hit a snag while loading. Please try again in a moment.
                    {error.digest && <span className="mt-2 block font-mono text-xs">Ref: {error.digest}</span>}
                </>
            }
        >
            <Button onClick={reset}>
                <RotateCcw />
                Try again
            </Button>
            <Button asChild variant="outline">
                <Link href={path("/university-list")}>Back to schools</Link>
            </Button>
        </ErrorScreen>
    );
}
