import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import useStore from '../../zustand/usePointStore';
import SchoolLogo from '../Avatar';
import CustomLink from '../CustomLink';
import styles from './styles/schoolDetail.module.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PhoneCall, Mail, School, MapPinHouse, Building2 } from 'lucide-react';
import { capitalizeFirst } from '../../utils/common';
const HighSchoolDetail = () => {
    const { isOpen, setIsOpen, selectedPoint } = useStore()
    const { properties } = selectedPoint || {};
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
    const [isMobile, setIsMobile] = useState(false);

    // Check screen width on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 576);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile) return null;
    return (
        <Dialog open={isOpen} onOpenChange={() => { setIsOpen(false) }} key={id}>
            <DialogContent className={styles.dialog_content}>
                <DialogHeader>
                    <DialogTitle style={{ fontSize: 24 }} title='Tên trường'>
                        <a href={webpage} target="_blank" rel="noopener noreferrer" className={styles.link}>
                            {name || 'N/A'}
                        </a>
                    </DialogTitle>
                    <div className={styles.container}>
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
                </DialogHeader>
            </DialogContent>

        </Dialog>
    );
};

export default HighSchoolDetail;
