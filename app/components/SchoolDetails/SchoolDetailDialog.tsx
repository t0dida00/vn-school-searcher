import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import useStore from '../../zustand/usePointStore';
import RankTag from '../RankTag';
import { SchoolDetailActions, SchoolDetailBody, SchoolDetailHeader } from './SchoolDetailContent';

const SchoolDetailDialog = () => {
    const { isOpen, setIsOpen, selectedPoint, setSelectedPoint } = useStore();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 576);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile || !selectedPoint) return null;

    const close = () => {
        const closing = selectedPoint;
        setIsOpen(false);
        // Clear after the close animation so the content doesn't vanish mid-fade,
        // unless another school was picked in the meantime
        setTimeout(() => {
            if (useStore.getState().selectedPoint === closing) setSelectedPoint(null);
        }, 200);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
            <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
                <DialogHeader className="border-b p-5 pr-12">
                    <SchoolDetailHeader
                        school={selectedPoint}
                        title={<DialogTitle className="text-xl leading-snug">{selectedPoint.properties?.name}<RankTag school={selectedPoint} className="ml-2" /></DialogTitle>}
                    />
                    <DialogDescription className="sr-only">
                        Details about {selectedPoint.properties?.name}
                    </DialogDescription>
                </DialogHeader>
                <div className="min-h-0 flex-1 overflow-y-auto p-5">
                    <SchoolDetailBody key={selectedPoint.properties?.id} school={selectedPoint} />
                </div>
                <div className="border-t bg-muted/30 p-4">
                    <SchoolDetailActions school={selectedPoint} />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SchoolDetailDialog;
