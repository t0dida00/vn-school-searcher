import React, { useState, useEffect } from "react";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import styles from "./styles/filter.module.scss";
import { FilterCombobox } from "./FilterCombobox";

type Option = { label: string; value: string };

export default function FilterSection() {
    const [dataset, setDataset] = useState("university");
    const [system, setSystem] = useState("all");
    const [includeCollege, setIncludeCollege] = useState(false);
    const [city, setCity] = useState("");
    const [field, setField] = useState("");

    const [cityOptions, setCityOptions] = useState<Option[]>([]);
    const [fieldOptions, setFieldOptions] = useState<Option[]>([]);
    const [systemOptions, setSystemOptions] = useState<Option[]>([]);
    const [datasetOptions, setDatasetOptions] = useState<Option[]>([]);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const res = await fetch("/filter-options.json");
                const data = await res.json();
                setCityOptions(data.cities);
                setFieldOptions(data.fields);
                setSystemOptions(data.systems);
                setDatasetOptions(data.datasets);
            } catch (err) {
                console.error("Error loading filter options", err);
            }
        };
        loadOptions();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            dataset,
            system,
            includeCollege,
            city,
            field
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.filter_container}>
            {/* Dataset */}
            <div className="mb-4">
                <Label className="mb-2 block">Dataset</Label>
                <RadioGroup
                    value={dataset}
                    onValueChange={setDataset}
                    className="flex gap-4 flex-row md:flex-row"
                >
                    {datasetOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label htmlFor={option.value}>{option.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            {/* City */}
            <div className="mb-4">
                <FilterCombobox
                    options={cityOptions}
                    placeholder="Thành phố"
                    value={city}
                    onChange={setCity}
                    className="w-full"
                />
            </div>

            {/* Field */}
            <div className="mb-4">
                <FilterCombobox
                    options={fieldOptions}
                    placeholder="Ngành học"
                    value={field}
                    onChange={setField}
                    className="w-full"
                    disabled={dataset !== "university"}
                />
            </div>

            {/* System */}
            <div className="mb-4">
                <Label className="mb-2 block">Hệ</Label>
                <RadioGroup
                    value={system}
                    onValueChange={setSystem}
                    className="flex gap-4 flex-row md:flex-row"
                >
                    {systemOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label htmlFor={option.value}>{option.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            {/* Include College */}
            <div className="mb-4 flex items-center space-x-2">
                <Checkbox
                    id="cao-dang"
                    checked={dataset === "university" && includeCollege}
                    disabled={dataset !== "university"}
                    onCheckedChange={(checked) => setIncludeCollege(!!checked)}
                />
                <Label htmlFor="cao-dang">Gồm Cao Đẳng</Label>
            </div>

            <Button type="submit" className="w-full">Filter</Button>
        </form>
    );
}
