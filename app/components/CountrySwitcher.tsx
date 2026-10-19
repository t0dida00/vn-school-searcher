"use client"
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronDown, Globe } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import CountryFlag from "./CountryFlag";
import { COUNTRIES, COUNTRY_CODES, countryPath, type CountryCode } from "../lib/countries";
import { useCountry } from "../utils/useCountry";

// Where a country lands from the current page: the map stays the map (when it has one), anything else
// (list, a school page that only exists in one country) goes to its university list
function targetPath(pathname: string | null, code: CountryCode) {
    const section = pathname?.split("/")[2];
    return countryPath(code, section === "map" && COUNTRIES[code].hasMap ? "/map" : "/university-list");
}

// Header pill showing the current country; opens a list of the others and a link to /countries
export default function CountrySwitcher() {
    const current = useCountry();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const { name, hero } = COUNTRIES[current];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                aria-label={`Country: ${name}. Change country`}
                className="flex items-center gap-1.5 rounded-full border px-2 py-1 text-sm font-medium transition-colors hover:bg-muted data-[state=open]:bg-muted"
            >
                <CountryFlag hero={hero} className="h-3.5 w-auto" />
                {/* Flag only on the narrowest phones so the nav still fits */}
                <span className="max-[359px]:hidden">{name}</span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-60 p-1.5">
                <p className="px-2 pb-1 pt-1.5 text-xs font-medium text-muted-foreground">Country</p>
                <ul>
                    {COUNTRY_CODES.map((code) => {
                        const country = COUNTRIES[code];
                        const active = code === current;
                        return (
                            <li key={code}>
                                <Link
                                    href={targetPath(pathname, code)}
                                    onClick={() => setOpen(false)}
                                    aria-current={active ? "true" : undefined}
                                    className={cn("flex items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-muted", active && "font-semibold")}
                                >
                                    <CountryFlag hero={country.hero} className="h-4 w-auto" />
                                    <span className="flex-1">{country.name}</span>
                                    {active && <Check className="size-4" />}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                <div className="my-1 border-t" />
                <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                    <Globe className="size-4" />
                    All countries
                </Link>
            </PopoverContent>
        </Popover>
    );
}
