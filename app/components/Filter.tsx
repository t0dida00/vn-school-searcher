// FilterSection.tsx
import React, { useState } from "react";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import styles from "./styles/filter.module.scss";
import { CityList } from "./CityList";
import { FieldList } from "./FieldList";

export default function FilterSection() {
    const [dataset, setDataset] = useState("university");
    const [system, setSystem] = useState("all");
    const [includeCollege, setIncludeCollege] = useState(false);
    const [city, setCity] = useState("");
    const [field, setField] = useState("");
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
        <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
        >
            <AccordionItem value="item-1">
                <AccordionTrigger className=" text-lg font-semibold text-center">Filter</AccordionTrigger>
                <AccordionContent >
                    <form onSubmit={handleSubmit} className={styles.filter_container}>
                        <div className="mb-4">
                            <Label className="mb-2 block">Dataset</Label>
                            <RadioGroup value={dataset} onValueChange={setDataset} className="flex gap-4 flex-col md:flex-row">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="university" id="university" />
                                    <Label htmlFor="university">University</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="highschool" id="highschool" />
                                    <Label htmlFor="highschool">High School</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* City select */}
                        <CityList value={city} onChange={setCity} />

                        {/* Field select (stubbed) */}
                        <FieldList value={field} onChange={setField} />

                        {/* Hệ */}
                        <div className="mb-4">
                            <Label className="mb-2 block">Hệ</Label>
                            <RadioGroup value={system} onValueChange={setSystem} className="flex gap-4 flex-col md:flex-row">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="all" id="all" />
                                    <Label htmlFor="all">All</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="cong-lap" id="cong-lap" />
                                    <Label htmlFor="cong-lap">Công lập</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="tu-thuc" id="tu-thuc" />
                                    <Label htmlFor="tu-thuc">Tư thục</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Checkbox */}
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
                </AccordionContent>
            </AccordionItem>

        </Accordion>

    );
}
