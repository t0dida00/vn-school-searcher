import React, { useEffect, useState } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import useStore from '../../zustand/usePointStore';
import RankTag from '../RankTag';
import { SchoolDetailActions, SchoolDetailBody, SchoolDetailBodyPending, SchoolDetailHeader } from './SchoolDetailContent';
import { useSchoolDetails } from './useSchoolDetails';

const SchoolDrawer: React.FC = () => {
    const { selectedPoint, setSelectedPoint, isOpen } = useStore();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 576);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (selectedPoint) {
            setIsDrawerOpen(true);
        }
    }, [selectedPoint]);

    // Closed from outside, e.g. a campus row flying the map to that campus
    useEffect(() => {
        if (!isOpen) setIsDrawerOpen(false);
    }, [isOpen]);

    const handleDrawerClose = () => {
        const closing = selectedPoint;
        setIsDrawerOpen(false);
        setTimeout(() => {
            if (useStore.getState().selectedPoint === closing) setSelectedPoint(null);
        }, 200);
    };

    // The map selects slim GeoJSON; the rest of the school loads here
    const details = useSchoolDetails(selectedPoint);

    if (!isMobile || !selectedPoint) return null;

    return (
        <Drawer open={isDrawerOpen} onOpenChange={(open) => {
            if (!open) handleDrawerClose();
        }}>
            <DrawerContent className="max-h-[85dvh]">
                <DrawerHeader className="border-b px-4 pb-4 pt-2">
                    <SchoolDetailHeader
                        school={selectedPoint}
                        title={<DrawerTitle className="text-lg leading-snug">{selectedPoint.properties?.name}<RankTag school={selectedPoint} className="ml-2" /></DrawerTitle>}
                    />
                    <DrawerDescription className="sr-only">
                        Details about {selectedPoint.properties?.name}
                    </DrawerDescription>
                </DrawerHeader>
                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                    {details.school ? (
                        <SchoolDetailBody key={selectedPoint.properties?.id} school={details.school} />
                    ) : (
                        <SchoolDetailBodyPending error={details.error} onRetry={details.retry} />
                    )}
                </div>
                <DrawerFooter className="mt-0 border-t pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <SchoolDetailActions school={details.school ?? selectedPoint} pending={details.loading} />
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default SchoolDrawer;
