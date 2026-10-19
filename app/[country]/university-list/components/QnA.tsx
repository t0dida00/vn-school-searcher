"use client";
import React from 'react';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CONTACT_EMAIL } from './SubFooter';
import { useCountryConfig } from '../../../utils/useCountry';
import type { Country } from '../../../lib/countries';

const ExternalLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">
        {children}
    </a>
);

const EmailLink = ({ subject }: { subject: string }) => (
    <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`} className="font-medium underline underline-offset-4">
        {CONTACT_EMAIL}
    </a>
);

type FaqItem = { question: string; answer: React.ReactNode };

// Some answers only apply to Finland (UAS, Studyinfo, the map, tuition fees); `false` entries are dropped
function faqGroups({ code, brand, adjective, hasMap, ranking }: Country): { title: string; items: (FaqItem | false)[] }[] {
    const fi = code === "fi";
    return [
        {
            title: `Using ${brand}`,
            items: [
                {
                    question: "How can I find a suitable university?",
                    answer: (
                        <>
                            Search by school name, city or field of study, then narrow the results with the filters. Open
                            a card to see the overview, {fi && <>tuition, scholarships, </>}fields of study and contact
                            details.{hasMap && <> Or switch to the map view to explore schools by location.</>}
                        </>
                    ),
                },
                fi && {
                    question: "What is the difference between a university and a UAS?",
                    answer: (
                        <>
                            Finnish universities focus on research and academic study and award bachelor&apos;s,
                            master&apos;s and doctoral degrees. Universities of applied sciences (UAS) focus on practical,
                            working-life oriented education and award bachelor&apos;s and master&apos;s degrees; a UAS
                            master&apos;s usually requires some work experience.
                        </>
                    ),
                },
                {
                    question: "How do I apply?",
                    answer: (
                        fi ? (
                            <>
                                {brand} doesn&apos;t handle applications. Most degree programmes in Finland are applied for
                                through the national service <ExternalLink href="https://opintopolku.fi/konfo/en/">Studyinfo.fi</ExternalLink>,
                                but some programmes have their own process, so always follow the instructions on the
                                school&apos;s official website.
                            </>
                        ) : (
                            <>
                                {brand} doesn&apos;t handle applications. Admission rules, deadlines and the documents you
                                need differ between schools and between domestic and international applicants, so always
                                follow the instructions on the school&apos;s official website.
                            </>
                        )
                    ),
                },
            ],
        },
        {
            title: "About the data",
            items: [
                hasMap && {
                    question: "Is the map accurate?",
                    answer: (
                        <>
                            Not 100%. The base map comes from Mapbox and OpenStreetMap, and the outline of Finland is a
                            simplified shape based on geoBoundaries and OpenStreetMap data. Borders, coastlines and place
                            names may be inaccurate or out of date and don&apos;t represent any official or political
                            position. Each school&apos;s pin shows an approximate location, usually the main campus, so
                            check the exact address before you travel.
                        </>
                    ),
                },
                {
                    question: "Is the school information accurate?",
                    answer: (
                        <>
                            We collect the information from the schools&apos; official websites and public sources, but
                            details such as programmes, tuition fees, scholarships and contact information change often,
                            and our copy may be incomplete or out of date. Always confirm everything on the school&apos;s
                            official website before making a decision.
                        </>
                    ),
                },
                {
                    question: "Where do the rankings come from?",
                    answer: (
                        <>
                            The &quot;#&quot; next to a school&apos;s name is its position in the{" "}
                            <ExternalLink href={ranking.url}>{ranking.source}</ExternalLink>
                            {fi && <>, which ranks universities and universities of applied sciences together</>}. uniRank is based on
                            web metrics, not on teaching or research quality, so treat it as one rough signal among many.
                            Schools that uniRank doesn&apos;t list have no rank.
                        </>
                    ),
                },
                fi && {
                    question: "Are the tuition fees and scholarships up to date?",
                    answer: (
                        <>
                            They are indicative only. Fees usually apply to students from outside the EU/EEA, vary by
                            programme and change from year to year, and scholarship rules differ between schools. Check
                            the current amounts and eligibility on the school&apos;s official website.
                        </>
                    ),
                },
            ],
        },
        {
            title: "Disclaimer",
            items: [
                {
                    question: `Is ${brand} an official website?`,
                    answer: (
                        <>
                            No. {brand} is an independent project and isn&apos;t affiliated with, endorsed by or
                            connected to any {adjective} {fi ? "university, university of applied sciences" : "university"} or
                            government authority.
                            School names and logos belong to their respective owners and are shown only to identify the
                            schools.
                        </>
                    ),
                },
                {
                    question: "Who is responsible for decisions made using this information?",
                    answer: (
                        <>
                            All content on {brand} is provided free of charge, &quot;as is&quot; and for general
                            information only. It isn&apos;t official admissions, legal or financial advice. We make no
                            guarantee that the information is complete, accurate or current, and we accept no
                            responsibility for any loss, cost or missed opportunity resulting from its use. You are
                            responsible for verifying information with the schools and official sources before acting on
                            it.
                        </>
                    ),
                },
            ],
        },
        {
            title: "Feedback",
            items: [
                {
                    question: "I found a mistake. How can I report it?",
                    answer: (
                        <>
                            Thank you! Email <EmailLink subject={`${brand}: data correction`} /> with the school name, what is
                            wrong and, if possible, a link to the official source, and we&apos;ll update it.
                        </>
                    ),
                },
                {
                    question: "Can I contribute information to the website?",
                    answer: (
                        <>
                            Yes, contributions are welcome. If you know about a school that is missing, newer information
                            or ideas for the site, write to <EmailLink subject={`${brand}: contribution`} />.
                        </>
                    ),
                },
            ],
        },
    ];
}

const QnA: React.FC = () => {
    const groups = faqGroups(useCountryConfig()).map((group) => ({
        ...group,
        items: group.items.filter((item): item is FaqItem => !!item),
    }));
    return (
        <section className='mb-10 flex flex-col gap-6' aria-labelledby="qna-title">
            <h2 id="qna-title" className='text-center text-lg font-semibold'>
                Questions &amp; answers
            </h2>
            {groups.map((group) => (
                <div key={group.title}>
                    <h3 className='mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                        {group.title}
                    </h3>
                    <Accordion type="single" collapsible>
                        {group.items.map((item) => (
                            <AccordionItem key={item.question} value={item.question}>
                                <AccordionTrigger className='cursor-pointer text-base'>{item.question}</AccordionTrigger>
                                <AccordionContent className='text-sm leading-relaxed text-muted-foreground'>
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            ))}
        </section>
    );
};

export default QnA;
