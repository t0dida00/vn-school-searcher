"use client";
import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useSavedStore, { useSavedIds } from "../zustand/useSavedStore";
import { schoolId } from "../utils/schoolId";

/** Heart toggle that adds/removes a school from the shortlist */
export default function SaveButton({ school, className }: { school: any; className?: string }) {
    const id = schoolId(school);
    const saved = useSavedIds().includes(id);
    const name = school?.properties?.name ?? "school";

    return (
        <Button
            type="button"
            size="icon"
            variant="outline"
            aria-pressed={saved}
            aria-label={saved ? `Remove ${name} from saved` : `Save ${name}`}
            title={saved ? "Saved" : "Save"}
            onClick={() => useSavedStore.getState().toggle(id)}
            className={cn("shrink-0", className)}
        >
            <Heart className={cn(saved && "fill-red-500 text-red-500")} />
        </Button>
    );
}
