import React from 'react';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
    {
        question: "Is the information on the website accurate?",
        answer:
            "We strive to update information from the official sources of the universities. However, to ensure absolute accuracy, you should verify the information on the official websites of the universities you're interested in."
    },
    {
        question: "How can I find a suitable university?",
        answer:
            "You can use the search filters on the homepage to search by university name, field of study, location, or other criteria. We also provide detailed information about each university to help you compare and make the right decision."
    },
    {
        question: "Can I contribute information to the website?",
        answer:
            "We always welcome contributions from the community. If you have updated information or notice any inaccuracies, please contact us via email or social media."
    }
];
const QnA: React.FC = () => {
    return (
        <div className='flex flex-col items-center justify-center gap-4 mb-10'>
            <div className='text-lg font-semibold'>
                Q & A
            </div>
            <div className='w-full'>
                <Accordion type="single" collapsible>
                    {faqData.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className='cursor-pointer'>{item.question}</AccordionTrigger>
                            <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

        </div>
    );
};

export default QnA;