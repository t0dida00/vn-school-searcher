"use client";

import React, { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import CustomTooltip from "./Tooltip";
import { Funnel } from "lucide-react";
import FilterSection from "./Filter";

export default function CustomFunnel() {
    const [open, setOpen] = useState(false);

    return (
        <main className="flex items-center justify-center bg-gray-50">
            {/* Custom trigger */}
            <button className="fixed bottom-18 right-4 bg-gray-800 hover:bg-gray-700 text-white p-1 rounded-full shadow-lg transition z-50 cursor-pointer" onClick={() => setOpen(true)} >
                <CustomTooltip
                    name={<Funnel size={30} className="w-6 h-6" />}
                    title="Bộ lọc trường học"
                />
            </button>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="w-[300px]">
                    <SheetHeader>
                        <SheetTitle>Bộ lọc trường học</SheetTitle>
                        {/* <SheetDescription>
                            Hành động này không thể hoàn tác. Dữ liệu của bạn sẽ bị xóa khỏi hệ thống.
                        </SheetDescription> */}
                        <FilterSection />
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </main>
    );
}
