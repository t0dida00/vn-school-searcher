import React, { useEffect, useState } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import useStore from '../../zustand/usePointStore';
import styles from './styles/schoolDetail.module.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PhoneCall, Mail, School, MapPinHouse, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SchoolLogo from '../Avatar';
import CustomLink from '../CustomLink';
import { capitalizeFirst } from '../../utils/common';

const SchoolDrawer: React.FC = () => {
    const { selectedPoint, setSelectedPoint } = useStore();
    const { properties } = selectedPoint || {};
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const {
        name,
        code,
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
        wiki,
        introduce,
        fields,
        scholarships,
        ranking,
    } = properties || {};

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

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setTimeout(() => {
            setSelectedPoint(null);
        }, 200);
    };

    if (!isMobile) return null;

    return (
        <Drawer open={isDrawerOpen} onOpenChange={(open) => {
            if (!open) handleDrawerClose();
        }}>
            <DrawerContent className="max-h-[50vh] h-full" id='drawer'

            >
                <div className={styles.drawer_container}>
                    <DrawerHeader style={{ padding: "10px 0" }}>
                        <DrawerTitle style={{ fontSize: 24 }} title='Tên trường'>
                            <a href={webpage} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                {name || 'N/A'} {code && `(${code})`}
                                {ranking || ranking != 0 && <Badge className="ml-4 bg-black text-white text-[16px]"> {ranking}</Badge>}
                            </a>
                        </DrawerTitle>
                        <div className={`${styles.container} ${styles.mobile_drawer_container}`}>
                            <div className={styles.wrapper}>
                                {logo && <div className={styles.left_container}>
                                    <SchoolLogo src={logo} alt={name || code} href={webpage} />
                                </div>}

                                <div className={styles.middle_container}>
                                    <CustomLink url={webpage} shortUrl="Thông tin tuyển sinh" />
                                    {wiki && <CustomLink url={wiki} shortUrl="Wikipedia" />}
                                </div>
                                <div className={styles.right_container}>
                                    <div><PhoneCall size={24} /> {phone || 'N/A'}</div>
                                    <div><Mail size={24} /> {email || 'N/A'}</div>
                                    <div><School size={24} /> {capitalizeFirst(type) || 'N/A'}</div>
                                    <div><School size={24} /> {capitalizeFirst(type2) || 'N/A'}</div>
                                    <div><MapPinHouse /> {address || 'N/A'}</div>
                                    <div><Building2 /> {city || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    </DrawerHeader>

                    <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                        {introduce && (
                            <AccordionItem value="item-1" className={styles.accordion_item}>
                                <AccordionTrigger className='text-xl cursor-pointer'>Giới thiệu</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-lg leading-[24px]">
                                    <p>{introduce}</p>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                        {fields && (
                            <AccordionItem value="item-2" className={styles.accordion_item}>
                                <AccordionTrigger className='text-xl cursor-pointer'>Chương trình đào tạo</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-2 text-lg leading-[24px]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{fields}</ReactMarkdown>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                        {majors && (
                            <AccordionItem value="item-3" className={styles.accordion_item}>
                                <AccordionTrigger className='text-xl cursor-pointer'>Chuyên ngành đào tạo</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-lg leading-[24px]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{majors}</ReactMarkdown>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                        {tuitions && (
                            <AccordionItem value="item-4" className={styles.accordion_item}>
                                <AccordionTrigger className='text-xl cursor-pointer'>Học phí</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-lg leading-[24px]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{tuitions}</ReactMarkdown>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                        {scholarships && (
                            <AccordionItem value="item-5" className={styles.accordion_item}>
                                <AccordionTrigger className='text-xl cursor-pointer'>Học bổng</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-lg leading-[24px]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{scholarships}</ReactMarkdown>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                    </Accordion>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default SchoolDrawer;
