// CityList.tsx
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const frameworks = [
    { value: "hanoi", label: "Hà Nội" },
    { value: "hcm", label: "TP. HCM" },
    { value: "danang", label: "Đà Nẵng" },
];

export function CityList({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between w-full mb-4"
                >
                    {value
                        ? frameworks.find((f) => f.value === value)?.label
                        : "Thành phố"}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Command>
                    <CommandInput placeholder="Tìm" className="h-9" />
                    <CommandList>
                        <CommandEmpty>Không tìm thấy thành phố nào</CommandEmpty>
                        <CommandGroup>
                            {frameworks.map((f) => (
                                <CommandItem
                                    key={f.value}
                                    value={f.value}
                                    onSelect={(currentValue) => {
                                        const isSelected = currentValue === value;
                                        onChange(isSelected ? "" : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    {f.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === f.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
