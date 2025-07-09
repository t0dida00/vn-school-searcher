"use client";
import React, { useState } from "react";
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
const PAGE_SIZE = 20;

export default function UniversityListPage() {
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const router = useRouter();
    const [level, setLevel] = useState("");
    const [major, setMajor] = useState("");
    const [city, setCity] = useState("");
    const [type, setType] = useState("");
    const [levelOptions, setLevelOptions] = useState([]);
    const [majorOptions, setMajorOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);

    React.useEffect(() => {
        const loadOptions = async () => {
            try {
                const res = await fetch("/filter-options.json");
                const data = await res.json();
                setLevelOptions(data.datasets || []); // "Đại học", "THPT"
                setMajorOptions(data.fields);   // majors
                setCityOptions(data.cities);    // cities
                setTypeOptions(data.systems);   // Công lập / Tư thục
                setLevel(data.datasets[0].value);
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
        if (inView && visibleCount < mockUniversities.length) {
            setVisibleCount((prev) => prev + PAGE_SIZE);
        }
    }, [inView, visibleCount]);

    const visibleItems = mockUniversities.slice(0, visibleCount);

    return (
        <main className="mx-auto max-w-[768px] px-4 min-h-screen relative">
            <h1 className="text-3xl font-bold text-center mb-2">FinUnies</h1>
            <p className="text-center text-gray-400 mb-6">
                Tìm thông tin trường đại học Việt Nam dễ dàng
            </p>


            <div className="flex flex-col gap-4 mb-6 sticky top-0 bg-white z-10 p-4 rounded-lg shadow-md border border-gray-200">
                <Input
                    type="text"
                    placeholder="Tìm kiếm trường đại học..."
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
                        placeholder="Thành phố"
                        value={city}
                        onChange={setCity}
                    />
                    <FilterCombobox
                        options={typeOptions}
                        placeholder="Loại trường"
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
                    Hiển thị {visibleItems.length} / {mockUniversities.length} kết quả
                </p>
            </div>

            <div className="pb-10">
                <Accordion type="single" collapsible>
                    {visibleItems.map((uni) => (
                        <React.Fragment key={uni.id}>
                            <AccordionItem className="p-0" value={uni.id.toString()}>
                                <AccordionTrigger className="text-left py-4  items-start gap-1 hover:no-underline ">
                                    <div>
                                        <div className="font-semibold text-lg hover:underline mb-2">{uni.name}</div>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline">{uni.type}</Badge>
                                            <Badge variant="outline">{uni.city}</Badge>
                                            <Badge variant="outline">{uni.field}</Badge>
                                        </div>
                                    </div>

                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="text-sm text-gray-400">
                                        Accordion Content
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </React.Fragment>
                    ))}
                </Accordion>
            </div>

            {/* Sentinel element để trigger load thêm */}
            {visibleItems.length < mockUniversities.length && (
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
