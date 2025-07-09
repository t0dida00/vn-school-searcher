"use client";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { FilterCombobox } from "../components/FilterCombobox";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { ArrowUp, Globe } from "lucide-react";
import CustomTooltip from "../components/Tooltip";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import useDataStore from "../zustand/useDataStore";
import { stringToArray } from "../utils/stringToArray";
const PAGE_SIZE = 20;
const baseUrl = process.env.NEXT_INTERNAL_BASE_URL || 'http://localhost:3000';

export default function UniversityListPage() {
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const router = useRouter();
    const [level, setLevel] = useState("");
    const [major, setMajor] = useState("");
    const [city, setCity] = useState("");
    const [type, setType] = useState("all");
    const [levelOptions, setLevelOptions] = useState([]);
    const [majorOptions, setMajorOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);
    const { data, setData, setError } = useDataStore()
    const [openItem, setOpenItem] = useState("nested-item-overview");
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('calling fetchData');
                const res = await fetch(`${baseUrl}/api/universities`);
                const data = await res.json();
                setData(data);
                setError(null);
            } catch (error) {
                setError(error instanceof Error ? error.message : String(error));
            }
        };

        fetchData();
    }, []);

    React.useEffect(() => {
        const loadOptions = async () => {
            try {
                const res = await fetch("/filter-options.json");
                const data = await res.json();
                // setLevelOptions(data.datasets || []); // "Đại học", "THPT"
                setMajorOptions(data.fields);   // majors
                setCityOptions(data.cities);    // cities
                setTypeOptions(data.systems);   // Công lập / Tư thục
                // setLevel(data.datasets[0].value);
            } catch (error) {
                console.error("Failed to load filter options", error);
            }
        };
        loadOptions();
    }, []);
    const { ref, inView } = useInView({
        threshold: 1,
        triggerOnce: false,
    });

    // Tự động tăng số lượng khi cuộn xuống
    React.useEffect(() => {
        if (inView && visibleCount < data?.length) {
            setVisibleCount((prev) => prev + PAGE_SIZE);
        }
    }, [inView, visibleCount]);

    const visibleItems = data?.slice(0, visibleCount);
    return (
        <main className="mx-auto max-w-[768px] px-4 min-h-screen relative">
            <h1 className="text-3xl font-bold text-center mb-2">FinUnies</h1>
            <p className="text-center text-gray-400 mb-6">
                Easily find information about Finnish universities
            </p>


            <div className="flex flex-col gap-4 mb-6 sticky top-0 bg-white z-10 p-4 rounded-lg shadow-md border border-gray-200">
                <Input
                    type="text"
                    placeholder="Find universities by name, code, address or city"
                    className="flex-1 px-4 py-2 rounded-md focus:outline-none w-full"
                />
                <div className=" gap-2 flex-wrap flex-col hidden sm:flex sm:flex-row">
                    {/* <FilterCombobox
                        options={levelOptions}
                        placeholder="Cấp"
                        value={level}
                        onChange={setLevel}
                    /> */}
                    <FilterCombobox
                        options={majorOptions}
                        placeholder="Field of study"
                        value={major}
                        onChange={setMajor}
                    // disabled={level !== "university"} // Chỉ cho phép chọn ngành khi đã chọn cấp
                    />
                    <FilterCombobox
                        options={cityOptions}
                        placeholder="City"
                        value={city}
                        onChange={setCity}
                    />
                    <FilterCombobox
                        options={typeOptions}
                        placeholder="Type"
                        value={type}
                        onChange={setType}
                    />
                </div>
                <Accordion type="single" collapsible className="sm:hidden">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="p-0 text-[16px]">Advanced Filters</AccordionTrigger>
                        <AccordionContent className="pb-0">
                            <div className="flex gap-2 flex-wrap flex-col sm:flex-row pt-2 text-[16px] ">
                                {/* <FilterCombobox
                                    options={levelOptions}
                                    placeholder="Cấp"
                                    value={level}
                                    onChange={setLevel}
                                /> */}
                                <FilterCombobox
                                    options={majorOptions}
                                    placeholder="Field of study"
                                    value={major}
                                    onChange={setMajor}
                                // disabled={level !== "university"} // Chỉ cho phép chọn ngành khi đã chọn cấp
                                />
                                <FilterCombobox
                                    options={cityOptions}
                                    placeholder="City"
                                    value={city}
                                    onChange={setCity}
                                />
                                <FilterCombobox
                                    options={typeOptions}
                                    placeholder="Type"
                                    value={type}
                                    onChange={setType}
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <p className=" text-sm text-gray-400 text-[14px]">
                    Show {visibleItems.length} / {data?.length} results
                </p>
            </div>

            <div className="pb-10">
                <Accordion type="single" collapsible >
                    {visibleItems.map((uni) => {
                        const { properties } = uni
                        const { city, fieldOptions, type, logo, overview, tuition, scholarship } = properties || {};
                        const formattedfieldOptions = stringToArray(fieldOptions);
                        console.log(city, 'city from uni');
                        return (
                            <React.Fragment key={uni._id}>
                                <AccordionItem className="p-0" value={uni._id}>
                                    <AccordionTrigger className="text-left py-4  items-start gap-1 hover:no-underline ">
                                        <div className="w-full cursor-pointer">
                                            <div className="font-semibold text-lg hover:underline mb-4 flex flex-row items-center justify-between w-full"><img src={logo} className="max-w-[300px] min-w-[120px] h-[120px]"></img>{properties.name}</div>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="outline">{type}</Badge>
                                                <Badge variant="outline">{city}</Badge>
                                                {formattedfieldOptions && formattedfieldOptions.length > 0 ? formattedfieldOptions.slice(0, 3).map((field: string, index: number) => (
                                                    <Badge key={index} variant="outline" >
                                                        {field}
                                                    </Badge>
                                                )) : null}
                                                {formattedfieldOptions && formattedfieldOptions.length - 3 > 0 ? "+" + (formattedfieldOptions.length - 3) : null}

                                            </div>
                                        </div>

                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Accordion type="single" collapsible defaultValue="nested-item-overview"  >
                                            {overview && (
                                                <AccordionItem value="nested-item-overview">
                                                    <AccordionTrigger className="text-xl cursor-pointer">Overview</AccordionTrigger>
                                                    <AccordionContent className="flex flex-col gap-4 text-lg leading-[24px]">
                                                        {overview}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )}
                                            {tuition && (
                                                <AccordionItem value="nested-item-tuition">
                                                    <AccordionTrigger className="text-xl cursor-pointer">Tuition</AccordionTrigger>
                                                    <AccordionContent className="flex flex-col gap-4 text-lg leading-[24px]">
                                                        {tuition}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )}
                                            {scholarship && (
                                                <AccordionItem value="nested-item-scholarship">
                                                    <AccordionTrigger className="text-xl cursor-pointer">Scholarship</AccordionTrigger>
                                                    <AccordionContent className="flex flex-col gap-4 text-lg leading-[24px]">
                                                        {scholarship}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )}
                                        </Accordion>
                                    </AccordionContent>
                                </AccordionItem>
                            </React.Fragment>
                        )

                    })}
                </Accordion>
            </div>

            {/* Sentinel element để trigger load thêm */}
            {visibleItems.length < data.length && (
                <div ref={ref} className="text-center py-6 text-gray-400">
                    Đang tải thêm...
                </div>
            )}
            <button
                onClick={() => router.push("/map")}
                className="fixed bottom-18 right-4 bg-gray-800 hover:bg-gray-700 text-white p-1 rounded-full shadow-lg transition z-50 cursor-pointer"
                aria-label="Go to map mode"
            >
                <CustomTooltip
                    name={<Globe className="w-6 h-6" />}
                    title="Chế độ bản đồ"
                />

            </button>
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-6 right-4 bg-gray-800 hover:bg-gray-700 text-white p-1 rounded-full shadow-lg transition z-50  cursor-pointer"
                aria-label="Scroll to top"
            >
                <CustomTooltip
                    name={<ArrowUp className="w-6 h-6" />}
                    title="Lên đầu trang"
                />

            </button>


        </main>
    );
}

// Giả lập 300 trường
const mockUniversities = Array.from({ length: 50 }).map((_, index) => ({
    id: index + 1,
    name: `Đại học số ${index + 1}`,
    type: index % 2 === 0 ? "Công lập" : "Tư thục",
    city: index % 3 === 0 ? "Hà Nội" : "TP.HCM",
    field: "Khoa học máy tính",
}));
