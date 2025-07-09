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
import { stringToArray } from '@/app/utils/stringToArray';

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
        website,
        wiki,
        overview,
        tuition,
        scholarship,
        fieldOptions
    } = properties || {};
    const formattedfieldOptions = stringToArray(fieldOptions);

    const [isMobile, setIsMobile] = useState(false);
    // console.log(fieldOptions, typeof (fieldOptions));
    // console.log(properties)
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
                        <a href={website} target="_blank" rel="noopener noreferrer" className={styles.link}>
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
                            {logo && (<div className={styles.left_container}>
                                <SchoolLogo src={logo} alt={name || code} href={website} />
                            </div>)}

                            {/* <div className={styles.middle_container}>
                                <CustomLink url={webpage} shortUrl="Thông tin tuyển sinh" />
                                {wiki && <CustomLink url={wiki} shortUrl="Đề án tuyển sinh" />}
                                {wiki && <CustomLink url={wiki} shortUrl="Wikipedia" />}
                            </div> */}
                            <div className={styles.right_container}>
                                {phone && <div><PhoneCall size={24} /> {phone}</div>}
                                {email && <div><Mail size={24} /> {email}</div>}
                                {type && <div><School size={24} /> {capitalizeFirst(type)}</div>}
                                {type2 && <div><School size={24} /> {capitalizeFirst(type2)}</div>}
                                {address && <div><MapPinHouse /> {address}</div>}
                                {city && <div><Building2 /> {city}</div>}
                                {website && <CustomLink url={website} shortUrl="Website" />}
                            </div>
                        </div>
                    </div>

                    <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                        {overview && (
                            <AccordionItem value="item-1" className={styles.accordion_item}>
                                <AccordionTrigger className="text-xl cursor-pointer">Overview</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-lg leading-[24px]">
                                    <p>{overview}</p>
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
                        {tuition && (
                            <AccordionItem value="item-4" className={styles.accordion_item}>
                                <AccordionTrigger className="text-xl cursor-pointer">Tuitions</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-lg leading-[24px]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{tuition}</ReactMarkdown>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                        {scholarship && (
                            <AccordionItem value="item-5" className={styles.accordion_item}>
                                <AccordionTrigger className="text-xl cursor-pointer">Scholarships</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-lg leading-[24px]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{scholarship}</ReactMarkdown>
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
                    {formattedfieldOptions && formattedfieldOptions.length > 0 ? formattedfieldOptions.map((field: string, index: number) => (
                        <Badge key={index} variant="secondary" className={styles.badge}>
                            {field}
                        </Badge>
                    )) : null}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SchoolDetailDialog;
