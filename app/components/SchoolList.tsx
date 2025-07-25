import React from "react";
import { Button } from "@/components/ui/button"; // Điều chỉnh lại nếu sai đường dẫn
import useStore from "../zustand/usePointStore";
import { useZoomToPoint } from "../hooks/useZoomToPoint";
import useDataStore from "../zustand/useDataStore";
import { Loader2Icon } from "lucide-react";

interface SchoolListProps {
    map: mapboxgl.Map | null; // hoặc kiểu tương ứng nếu không dùng Mapbox
    setQuery: (query: string) => void; // Thêm prop này nếu cần
}
import type { Feature, Point } from 'geojson';

type SchoolPoint = Feature<Point, { name?: string; code?: string }>;
const SchoolList: React.FC<SchoolListProps> = ({ map, setQuery }) => {
    const { points } = useStore();
    const { filteredData, loading, error } = useDataStore();
    const zoomToPoint = useZoomToPoint(map);
    const renderPoints = (list: SchoolPoint[]) => {
        if (list.length === 0) {
            return (
                <div className="w-full h-full flex items-center justify-center text-gray">
                    No result found
                </div>
            );
        }

        return (
            <ul>
                {list.map((point, index) => {
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
                            onClick={() => {
                                if (coords) {
                                    zoomToPoint(point);
                                    setQuery(name);
                                }
                            }}
                        >
                            <Button
                                variant="link"
                                className="cursor-pointer p-0 text-left font-[600] whitespace-normal h-fit"
                            >
                                {index + 1}. {`${name}${code ? ` (${code})` : ""}`}
                            </Button>
                        </li>
                    );
                })}
            </ul>
        );
    };

    if (loading) {
        return (<div className="w-full h-full flex items-center justify-center">
            <Loader2Icon className="animate-spin " />
        </div>
        )
    }
    if (error) {
        return <div className="w-full h-full flex items-center justify-center text-red-500"> Error: {error}</div>;
    }
    return <ul className="flex flex-col gap-y-3 p-2 empty:hidden">{renderPoints(filteredData ? filteredData : points)}</ul>;
};

export default SchoolList;
