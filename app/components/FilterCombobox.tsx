// components/FilterCombobox.tsx
"use client";

import * as React from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
    label: string;
    value: string;
};

interface FilterComboboxProps {
    options: Option[];
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    className?: string; // ✅ add this
    disabled?: boolean; // ✅ add this
}

export const FilterCombobox: React.FC<FilterComboboxProps> = ({
    options,
    placeholder,
    value,
    onChange,
    className = "",
    disabled = false,
}) => {
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
        if (disabled) {
            onChange("");
        }
    }, [disabled]);
    const selectedLabel =
        options.find((option) => option.value === value)?.label || placeholder;
    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn("flex-1 justify-between cursor-pointer", className)}
                    disabled={disabled}
                >
                    {selectedLabel}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-full p-0">
                <Command>
                    <CommandInput placeholder={`Tìm ${placeholder.toLowerCase()}...`} />
                    <CommandEmpty>Không có kết quả.</CommandEmpty>
                    <CommandGroup className=" max-h-128 overflow-y-auto">
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                onSelect={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover >
    );
};
