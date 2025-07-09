import React, { useState, useEffect } from "react";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
// import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import styles from "./styles/filter.module.scss";
import { FilterCombobox } from "./FilterCombobox";
import useDataStore from "../zustand/useDataStore";
import { stringToArray } from "../utils/stringToArray";
import { Trash } from "lucide-react";

type Option = { label: string; value: string };

export default function FilterSection() {
    const [dataset, setDataset] = useState("university");
    const [system, setSystem] = useState("all");
    // const [includeCollege, setIncludeCollege] = useState(false);
    const [city, setCity] = useState("");
    const [field, setField] = useState("");

    const [cityOptions, setCityOptions] = useState<Option[]>([]);
    const [fieldOptions, setFieldOptions] = useState<Option[]>([]);
    const [systemOptions, setSystemOptions] = useState<Option[]>([]);
    const [datasetOptions, setDatasetOptions] = useState<Option[]>([]);
    const { data, setFilteredData } = useDataStore()

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const res = await fetch("/filter-options.json");
                const data = await res.json();
                setCityOptions(data.cities);
                setFieldOptions(data.fields);
                setSystemOptions(data.systems);
                setDatasetOptions(data.datasets || []);
            } catch (err) {
                console.error("Error loading filter options", err);
            }
        };
        loadOptions();
    }, []);
    useEffect(() => {
        const saved = localStorage.getItem("university-filters");
        if (saved) {
            const { city, field, system } = JSON.parse(saved);
            setCity(city);
            setField(field);
            setSystem(system);
        }
    }, []);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Filter data based on selected options
        let filteredData = data;
        if (city === "" && field === "" && system === "all") {
            setFilteredData(null)
            return
        }
        const filters = { city, field, system };
        localStorage.setItem("university-filters", JSON.stringify(filters));

        filteredData = filteredData.filter(item => {
            const { properties } = item
            const cityMatch = properties.city.toLowerCase().includes(city.toLowerCase());
            const systemMatch = system === "all" || properties.type === system;
            const fieldMatch = !field || stringToArray(properties.fieldOptions).map(f => f.toLowerCase()).includes(field.toLowerCase());;
            return cityMatch && fieldMatch && systemMatch;
        });
        setFilteredData(filteredData);
    };

    return (
        <form onSubmit={handleSubmit} className={`${styles.filter_container} `}>
            {/* Dataset */}
            <div className="mb-4">
                <Label className="mb-2 block !text-[16px]">Dataset</Label>
                <RadioGroup
                    value={dataset}
                    onValueChange={setDataset}
                    className="flex gap-4 flex-row md:flex-row "
                >
                    {datasetOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2 cursor-pointer ">
                            <RadioGroupItem value={option.value} id={option.value} className=" cursor-pointer" />
                            <Label htmlFor={option.value} className="cursor-pointer !text-[16px]">{option.label}</Label>
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
                    placeholder="Fields of study"
                    value={field}
                    onChange={setField}
                    className="w-full"
                    disabled={dataset !== "university"}
                />
            </div>

            {/* System */}
            <div className="mb-4">
                <Label className="mb-2 block !text-[16px]">Type</Label>
                <RadioGroup
                    value={system}
                    onValueChange={setSystem}
                    className="flex gap-4 flex-row md:flex-row"
                >
                    {systemOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2 cursor-pointer">
                            <RadioGroupItem value={option.value} id={option.value} className="cursor-pointer" />
                            <Label htmlFor={option.value} className="cursor-pointer !text-[16px]">{option.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            {/* Include College */}
            {/* <div className="mb-4 flex items-center space-x-2">
                <Checkbox
                    id="cao-dang"
                    checked={dataset === "university" && includeCollege}
                    disabled={dataset !== "university"}
                    onCheckedChange={(checked) => setIncludeCollege(!!checked)}
                    className="cursor-pointer"
                />
                <Label htmlFor="cao-dang" className="cursor-pointer !text-[16px]">Gồm Cao Đẳng</Label>
            </div> */}
            <div className="flex gap-1 flex-row flex-wrap">
                <Button type="submit" className="flex-1 cursor-pointer !text-[16px]">Filter</Button>
                {localStorage.getItem("university-filters") && <Button type="button" className="w-[30px] cursor-pointer !text-[16px] bg-red-500" onClick={() => {
                    setCity("");
                    setField("");
                    setSystem("all");
                    localStorage.removeItem("university-filters");
                    setFilteredData(null);
                }}>
                    <Trash></Trash>
                </Button>}
            </div>

        </form>
    );
}
