"use client";

import React from "react";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";

interface CustomTooltipProps {
    name: React.ReactNode;
    title: string;
}

export default function CustomTooltip({ name, title }: CustomTooltipProps) {
    const isString = typeof name === "string";

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {isString ? (
                        <span className="cursor-pointer inline-flex items-center">
                            {name}
                        </span>
                    ) : (
                        name
                    )}
                </TooltipTrigger>
                <TooltipContent>
                    <p>{title}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
