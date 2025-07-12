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
import SubFooter from "./components/SubFooter";
import QnA from "./components/QnA";
import Breaker from "./components/breaker";
import Link from "next/link";
const PAGE_SIZE = 10;

export default function UniversityListPage() {
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const router = useRouter();
    // const [level, setLevel] = useState("");
    const [major, setMajor] = useState("");
    const [city, setCity] = useState("");
    const [type, setType] = useState("all");
    // const [levelOptions, setLevelOptions] = useState([]);
    const [majorOptions, setMajorOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);
    const { data, setFilteredData, filteredData, fetchData } = useDataStore()
    const [query, setQuery] = useState("");
    const source = filteredData ? filteredData : data;
    useEffect(() => {

        fetchData();
    }, []);
    useEffect(() => {

        let filteredData = data;
        if (city === "" && major === "" && type === "all") {
            setFilteredData(null)
            return
        }
        const filters = { city, major, type };
        localStorage.setItem("university-filters-list", JSON.stringify(filters));
        filteredData = filteredData.filter(item => {
            const { properties } = item
            const cityMatch = properties.city.toLowerCase().includes(city.toLowerCase());
            const systemMatch = type === "all" || properties.type === type;
            const fieldMatch = !major || stringToArray(properties.fieldOptions).map(f => f.toLowerCase()).includes(major.toLowerCase());;
            return cityMatch && fieldMatch && systemMatch;
        });
        setFilteredData(filteredData);
    }, [major, city, type]);
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

    React.useEffect(() => {
        const source = filteredData?.length ? filteredData : data;
        if (inView && visibleCount < source?.length) {
            setVisibleCount((prev) => prev + PAGE_SIZE);
        }
    }, [inView, visibleCount, filteredData, data]);
    React.useEffect(() => {
        const handler = setTimeout(() => {
            const trimmed = query.trim();
            if (trimmed.length < 3) {
                const customFilteredData = data.filter(item => {
                    const { properties } = item
                    const cityMatch = properties.city.toLowerCase().includes(city.toLowerCase());
                    const systemMatch = type === "all" || properties.type === type;
                    const fieldMatch = !major || stringToArray(properties.fieldOptions).map(f => f.toLowerCase()).includes(major.toLowerCase());;
                    return cityMatch && fieldMatch && systemMatch;
                });
                setFilteredData(customFilteredData);
                return;
            }
            const lowerQuery = query.toLowerCase();
            const filtered = source.filter((item: any) => {
                const { name, code, address, city } = item.properties || {};
                return (
                    name?.toLowerCase().includes(lowerQuery) ||
                    code?.toLowerCase().includes(lowerQuery) ||
                    address?.toLowerCase().includes(lowerQuery) ||
                    city?.toLowerCase().includes(lowerQuery)
                );
            });
            setFilteredData(filtered);
        }, 500);
        return () => clearTimeout(handler);
    }, [query, data, setFilteredData]);
    const visibleItems = React.useMemo(() => {
        const source = filteredData ? filteredData : data;

        return source?.slice(0, visibleCount);
    }, [filteredData, data, visibleCount]);
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
                    onChange={(e) => setQuery(e.target.value)}
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
                    Show {visibleItems.length} / {source?.length} results
                </p>
            </div>

            <div className="pb-10">
                <Accordion type="single" collapsible >
                    {visibleItems.map((uni) => {
                        const { properties } = uni
                        const { city, fieldOptions, type, logo, overview, tuition, scholarship, website } = properties || {};
                        const formattedfieldOptions = stringToArray(fieldOptions);
                        return (
                            <React.Fragment key={uni._id}>
                                <AccordionItem className="p-0" value={uni._id}>
                                    <AccordionTrigger className="text-left py-4  items-start gap-1 hover:no-underline ">
                                        <div className="w-full cursor-pointer">
                                            <div className="font-semibold text-lg hover:underline mb-4 flex flex-col sm:flex-row sm:items-center gap-2 justify-between w-fit sm:w-full">
                                                <img src={logo} className="max-w-[240px] sm:max-w-[300px] min-w-[120px] h-[120px]"></img>{properties.name}</div>
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
                                                        <p>
                                                            {overview}
                                                        </p>
                                                        <div className="flex flex-col sm:flex-row gap-2 justify-between">
                                                            <div className="font-[500]">
                                                                Location: {city}
                                                            </div>
                                                            <Link href={website} target="_blank" rel="noopener noreferrer" className="hover:underline underline font-[500] text-right">
                                                                Website: {website}
                                                            </Link>
                                                        </div>


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

            {visibleItems.length < source.length && (
                <div ref={ref} className="text-center py-6 text-gray-400">
                    Loading...
                </div>
            )}
            {source.length == 0 && data.length != 0 && (
                <div className="text-center py-6 text-gray-400">
                    Result not found
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
            <Breaker className="mb-10 w-full sm:w-[60%] m-auto " />
            <QnA />
            <SubFooter />
        </main>
    );
}

