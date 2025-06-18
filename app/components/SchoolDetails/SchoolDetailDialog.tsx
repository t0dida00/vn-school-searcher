import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import useStore from '../../zustand/usePointStore';
import SchoolLogo from '../Avatar';
import CustomLink from '../CustomLink';
import styles from './styles/schoolDetail.module.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PhoneCall, Mail, School, MapPinHouse, Building2 } from 'lucide-react';
import { capitalizeFirst } from '../../utils/common';
import { Badge } from "@/components/ui/badge";

const SchoolDetailDialog = () => {
    const { isOpen, setIsOpen, selectedPoint } = useStore();
    const { properties } = selectedPoint || {};
    const {
        id,
        name,
        code,
        city,
        address,
        email,
        fields,
        introduce,
        logo,
        majors,
        phone,
        ranking,
        scholarships,
        tuitions,
        type,
        type2,
        webpage,
        wiki,
    } = properties || {};

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 576);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile) return null;

    return (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)} key={id}>
            <DialogContent className={styles.dialog_content}>
                <DialogHeader>
                    <DialogTitle style={{ fontSize: 24 }} title='Tên trường'>
                        <a href={webpage} target="_blank" rel="noopener noreferrer" className={styles.link}>
                            {name || 'N/A'} {code && `(${code})`}
                            {ranking && (
                                <Badge title='Ranking' style={{ fontSize: "16px" }} className="ml-4 bg-black text-white">
                                    {ranking}
                                </Badge>
                            )}
                        </a>
                    </DialogTitle>

                    <div className={styles.container}>
                        <div className={styles.wrapper}>
                            <div className={styles.left_container}>
                                <SchoolLogo src={logo} alt={name || code} href={webpage} />
                            </div>
                            <div className={styles.middle_container}>
                                <CustomLink url={webpage} shortUrl="Thông tin tuyển sinh" />
                                {wiki && <CustomLink url={wiki} shortUrl="Đề án tuyển sinh" />}
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

                    <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                        {introduce && (
                            <AccordionItem value="item-1" className={styles.accordion_item}>
                                <AccordionTrigger className="text-xl cursor-pointer">Giới thiệu</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-lg leading-[24px]">
                                    <p>{introduce}</p>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                        {fields && (
                            <AccordionItem value="item-2" className={styles.accordion_item}>
                                <AccordionTrigger className="text-xl cursor-pointer">Chương trình đào tạo</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-2 text-lg leading-[24px]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{fields}</ReactMarkdown>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                        {majors && (
                            <AccordionItem value="item-3" className={styles.accordion_item}>
                                <AccordionTrigger className="text-xl cursor-pointer">Chuyên ngành đào tạo</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-lg leading-[24px]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{majors}</ReactMarkdown>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                        {tuitions && (
                            <AccordionItem value="item-4" className={styles.accordion_item}>
                                <AccordionTrigger className="text-xl cursor-pointer">Học phí</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-lg leading-[24px]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{tuitions}</ReactMarkdown>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                        {scholarships && (
                            <AccordionItem value="item-5" className={styles.accordion_item}>
                                <AccordionTrigger className="text-xl cursor-pointer">Học bổng</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-lg leading-[24px]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{scholarships}</ReactMarkdown>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                    </Accordion>
                </DialogHeader>

                {/* Optional badges/footer */}
                <DialogFooter className="pt-5 flex-wrap justify-start">
                    {/* Example dynamic badges - replace with real data if needed */}
                    {type && <Badge variant="secondary" className={styles.badge}>{capitalizeFirst(type)}</Badge>}
                    {city && <Badge variant="secondary" className={styles.badge}>{city}</Badge>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SchoolDetailDialog;
