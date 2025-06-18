//Can remove this file if not needed
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import useStore from '../../zustand/usePointStore';
import SchoolLogo from '../Avatar';
import CustomLink from '../CustomLink';
import styles from './styles/schoolDetail.module.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PhoneCall, Mail, School, MapPinHouse, Building2 } from 'lucide-react';
import { capitalizeFirst } from '../../utils/common';
// ✅ Rename your component here
const HighSchoolDrawer: React.FC = () => {
  const { selectedPoint, setSelectedPoint } = useStore();
  const { properties } = selectedPoint || {};
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  // Check screen width on mount and resize
  const {
    id,
    name,
    city,
    address,
    email,
    logo,
    phone,
    tuitions,
    type,
    type2,
    majors,
    webpage,
  } = properties || {};
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 576);
    };

    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  useEffect(() => {
    if (selectedPoint) {
      setIsDrawerOpen(true);
    }
  }, [selectedPoint]);
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setSelectedPoint(null); // clear data after animation
    }, 200);
  };
  if (!isMobile) return null;

  return (
    <Drawer open={isDrawerOpen} onOpenChange={(open) => {
      if (!open) handleDrawerClose(); // animate + cleanup
    }}>
      <DrawerContent className="max-h-[50vh] h-full" id='drawer'>
        <div className={styles.drawer_container}>
          <DrawerHeader>
            <DrawerTitle style={{ fontSize: 24 }} title='Tên trường'>
              <a href={webpage} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {name || 'N/A'}
              </a>
            </DrawerTitle>
            <div className={`${styles.container} ${styles.mobile_drawer_container}`}>
              <div className={styles.wrapper}>
                <div className={styles.left_container}>
                  <SchoolLogo src={logo} alt={name} href={webpage} />
                  {/* <CustomLink url={properties?.webpage} shortUrl="Website" /> */}
                </div>
                <div className={styles.middle_container}>
                  <CustomLink url={webpage} shortUrl="Thông tin tuyển sinh" />
                </div>
                <div className={styles.right_container}>
                  <div title='phone'><PhoneCall size={24} aria-description='phone' /> {phone || 'N/A'}</div>
                  <div title='email'> <Mail size={24} /> <p> {email || 'N/A'}</p></div>
                  <div title='type'> <School size={24} /> {capitalizeFirst(type) || 'N/A'}</div>
                  <div title='type2'> <School size={24} /> {capitalizeFirst(type2) || 'N/A'}</div>
                  <div title='address' > <MapPinHouse /> {address || 'N/A'}</div>
                  <div title='city'>  <Building2 />{city || 'N/A'}</div>
                </div>
              </div>
            </div>

          </DrawerHeader>
          <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-3" className={styles.accordion_item}>
              <AccordionTrigger className='text-xl cursor-pointer'>Thông tin tuyển sinh</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-lg  leading-[24px]">
                <ReactMarkdown remarkPlugins={[remarkGfm]} >{majors}</ReactMarkdown>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className={styles.accordion_item}>
              <AccordionTrigger className='text-xl cursor-pointer'>Học phí</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-lg  leading-[24px]">
                <ReactMarkdown remarkPlugins={[remarkGfm]} >{tuitions}</ReactMarkdown>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

      </DrawerContent>
    </Drawer>
  );
};

export default HighSchoolDrawer;
