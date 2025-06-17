import React from "react";
import { Button } from "@/components/ui/button"; // Điều chỉnh lại nếu sai đường dẫn
import useStore from "../zustand/usePointStore";
import { useZoomToPoint } from "../hooks/useZoomToPoint";
import useDataStore from "../zustand/useDataStore";
import { Loader2Icon } from "lucide-react";

interface SchoolListProps {
    map: mapboxgl.Map | null; // hoặc kiểu tương ứng nếu không dùng Mapbox
}

const SchoolList: React.FC<SchoolListProps> = ({ map }) => {
    const { points } = useStore();
    const { filteredData, loading, error } = useDataStore();

    const zoomToPoint = useZoomToPoint(map);
    const renderPoints = (list: any[]) =>
        list.map((point, index) => {
            const name = point.properties?.name || `Point ${index + 1}`;
            const code = point.properties?.code;
            const coords =
                point.geometry.type === "Point"
                    ? (point.geometry.coordinates as [number, number])
                    : null;

            return (
                <li
                    key={index}
                    style={{
                        cursor: coords ? "pointer" : "default",
                        color: coords ? "#0077cc" : "#666",
                    }}
                    onClick={() => coords && zoomToPoint(point)}
                >
                    <Button variant="link" className="cursor-pointer p-0 text-left font-[600] whitespace-normal h-fit">
                        {index + 1}. {`${name}${code ? ` (${code})` : ""}`}
                    </Button>
                </li>
            );
        });
    if (loading) {
        return (<div className="w-full h-full flex items-center justify-center">
            <Loader2Icon className="animate-spin " />
        </div>
        )
    }
    return <ul className="flex flex-col gap-y-3 mt-3">{renderPoints(filteredData.length > 0 ? filteredData : points)}</ul>;
};

export default SchoolList;
