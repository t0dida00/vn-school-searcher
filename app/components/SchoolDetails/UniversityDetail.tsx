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
} from "@/components/ui/accordion"
import useStore from '../../zustand/usePointStore';
import SchoolLogo from '../Avatar';
import CustomLink from '../CustomLink';
import styles from './styles/schoolDetail.module.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PhoneCall, Mail, School, MapPinHouse, Building2, Link } from 'lucide-react';
import { capitalizeFirst } from '../../utils/common';
import { Badge } from "@/components/ui/badge"
const UniversityDetail = () => {
  const { isOpen, setIsOpen, selectedPoint } = useStore()
  const { properties } = selectedPoint || {};
  const {
    id,
    name,
    city,
    code,
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
    wiki
  } = properties || {};
  const [isMobile, setIsMobile] = useState(false);

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
              {name || 'N/A'} {code && `(${code})`}
              {ranking && <Badge title='Ranking' style={{ fontSize: "16px" }} className={` ml-4 bg-[#000] text-white`} variant="secondary"> {ranking}</Badge>}
            </a>
          </DialogTitle>
          <div className={styles.container}>
            <div className={styles.wrapper}>
              <div className={styles.left_container}>
                <SchoolLogo src={logo} alt={code} href={webpage} />
                {/* <CustomLink url={properties?.webpage} shortUrl="Website" /> */}
              </div>
              <div className={styles.middle_container}>
                <CustomLink url={webpage} shortUrl="Thông tin tuyển sinh" />
                <CustomLink url={wiki} shortUrl="Đề án tuyển sinh" />
                <CustomLink url={wiki} shortUrl="Wikipedia" />
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
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1" className={styles.accordion_item}>
              <AccordionTrigger className='text-xl cursor-pointer'>Giới thiệu</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-lg leading-[24px]">
                <p>
                  {introduce || 'N/A'}
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className={styles.accordion_item}>
              <AccordionTrigger className='text-xl cursor-pointer'>Chương trình đào tạo</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 text-lg  leading-[24px] ">
                <ReactMarkdown remarkPlugins={[remarkGfm]} >{fields}</ReactMarkdown>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className={styles.accordion_item}>
              <AccordionTrigger className='text-xl cursor-pointer'>Chuyên ngành đào tạo</AccordionTrigger>
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
            <AccordionItem value="item-5" className={styles.accordion_item}>
              <AccordionTrigger className='text-xl cursor-pointer'>Học bổng</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-lg  leading-[24px]">
                <ReactMarkdown remarkPlugins={[remarkGfm]} >{scholarships}</ReactMarkdown>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogHeader>
        <DialogFooter style={{ justifyContent: 'flex-start', flexWrap: 'wrap', paddingTop: '20px' }}>
          <Badge variant="secondary" className={styles.badge}>Badge</Badge>
          <Badge variant="secondary" className={styles.badge}>Badge</Badge>
          <Badge variant="secondary" className={styles.badge}>Badge</Badge>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UniversityDetail;
