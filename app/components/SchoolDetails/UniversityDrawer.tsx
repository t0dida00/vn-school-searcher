import React, { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useStore from '../../zustand/usePointStore';

// ✅ Rename your component here
const UniversityDrawer: React.FC = () => {
  const { selectedPoint } = useStore();
  const [isMobile, setIsMobile] = useState(false);
  // Check screen width on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 576);
    };

    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <Drawer open={selectedPoint} >
      <DrawerContent className=' overflow-auto h-full'>
        <DrawerHeader>
          <DrawerTitle>
            <div>

            </div>
          </DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UniversityDrawer;
