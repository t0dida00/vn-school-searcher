import React from "react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CONTACT_EMAIL } from "../../lib/contact";

// The site-wide questions and answers on the landing page (/#faq). The country pages link here instead of
// keeping their own copy, so answers name no country: they hold for every entry in app/lib/countries.ts.

const ExternalLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-[#191919] underline underline-offset-4">
        {children}
    </a>
);

// Full policy pages, linked from the footer too
const PageLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className="font-medium text-[#191919] underline underline-offset-4">
        {children}
    </Link>
);

const EmailLink = ({ subject }: { subject: string }) => (
    <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`} className="font-medium text-[#191919] underline underline-offset-4">
        {CONTACT_EMAIL}
    </a>
);

const GROUPS: { title: string; items: { question: string; answer: React.ReactNode }[] }[] = [
    {
        title: "Using Unies",
        items: [
            {
                question: "How can I find a suitable university?",
                answer: (
                    <>
                        Choose a country, then search by school name, city or field of study and narrow the results with
                        the filters. Open a school to see its overview, fields of study, campuses and contact details, and
                        where we have them, tuition and scholarships. Or switch to the map to explore schools by location.
                    </>
                ),
            },
            {
                question: "What is a university of applied sciences?",
                answer: (
                    <>
                        Some countries split higher education in two. Universities focus on research and academic study
                        and award bachelor&apos;s, master&apos;s and doctoral degrees. Universities of applied sciences (UAS)
                        focus on practical, working-life oriented education and award bachelor&apos;s and master&apos;s
                        degrees. Where a country has both, the school list shows which is which.
                    </>
                ),
            },
            {
                question: "How do I apply?",
                answer: (
                    <>
                        Unies doesn&apos;t handle applications. In some countries most programmes are applied for through a
                        national application service; elsewhere each school runs its own admissions. Rules, deadlines and the
                        documents you need also differ between domestic and international applicants, so always follow the
                        instructions on the school&apos;s official website.
                    </>
                ),
            },
        ],
    },
    {
        title: "About the data",
        items: [
            {
                question: "Is the map accurate?",
                answer: (
                    <>
                        Not 100%. The base map comes from Mapbox and OpenStreetMap, and each country&apos;s outline is a
                        simplified shape based on geoBoundaries and OpenStreetMap data. Borders, coastlines and place names may
                        be inaccurate or out of date and don&apos;t represent any official or political position. Each pin shows
                        the approximate location of a campus (schools with several campuses have a smaller pin for each extra
                        one), so check the exact address before you travel.
                    </>
                ),
            },
            {
                question: "Is the school information accurate?",
                answer: (
                    <>
                        We collect the information from the schools&apos; official websites and public sources, but details
                        such as programmes, tuition fees, scholarships and contact information change often, and our copy may
                        be incomplete or out of date. Always confirm everything on the school&apos;s official website before
                        making a decision.
                    </>
                ),
            },
            {
                question: "Where do the rankings come from?",
                answer: (
                    <>
                        The &quot;#&quot; next to a school&apos;s name is its position in its country&apos;s{" "}
                        <ExternalLink href="https://www.unirank.org/">uniRank</ExternalLink> ranking. uniRank is based on web
                        metrics, not on teaching or research quality, so treat it as one rough signal among many. Schools that
                        uniRank doesn&apos;t list have no rank, and ranks only compare schools within the same country.
                    </>
                ),
            },
            {
                question: "Are the tuition fees and scholarships up to date?",
                answer: (
                    <>
                        They are indicative only, and not every school has them yet. Fees often depend on your citizenship,
                        vary by programme and change from year to year, and scholarship rules differ between schools. Check
                        the current amounts and eligibility on the school&apos;s official website.
                    </>
                ),
            },
        ],
    },
    {
        title: "Disclaimer and privacy",
        items: [
            {
                question: "Is Unies an official website?",
                answer: (
                    <>
                        No. Unies is an independent project and isn&apos;t affiliated with any university, government or
                        authority. School names and logos belong to their owners. See the full{" "}
                        <PageLink href="/disclaimer">disclaimer and terms of use</PageLink>.
                    </>
                ),
            },
            {
                question: "Can I rely on this information for my application?",
                answer: (
                    <>
                        Use it to compare and shortlist, then confirm everything with the school. The information is general
                        guidance, not admissions, legal or financial advice, and we can&apos;t guarantee it&apos;s complete or
                        current. Details are in the <PageLink href="/disclaimer">disclaimer</PageLink>.
                    </>
                ),
            },
            {
                question: "Do you collect my personal data?",
                answer: (
                    <>
                        No. There are no accounts, cookies or tracking tools. Your saved schools stay in your own browser and
                        are never sent to us. Map tiles come from Mapbox and the site is hosted on Vercel; the{" "}
                        <PageLink href="/privacy">privacy policy</PageLink> explains what they see.
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
                        Open the school and choose &quot;Report a problem&quot; at the bottom of its details: pick what&apos;s
                        wrong, such as the logo, the location or the information, and add the correct value or a link to the
                        source if you can. You can also email <EmailLink subject="Unies: data correction" />.
                    </>
                ),
            },
            {
                question: "Can I contribute information, or suggest a country?",
                answer: (
                    <>
                        Yes. If you know about a missing school, have newer information, or want another country added, write
                        to <EmailLink subject="Unies: contribution" />.
                    </>
                ),
            },
        ],
    },
];

export default function GeneralQnA({ headingClassName }: { headingClassName: string }) {
    return (
        <section id="faq" aria-labelledby="faq-title" className="scroll-mt-4 border-t border-black/10 bg-white">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:py-16 lg:grid-cols-[1fr_2fr] lg:gap-16">
                <div>
                    <h2 id="faq-title" className={`${headingClassName} text-3xl sm:text-4xl`}>
                        Questions and answers
                    </h2>
                    <p className="mt-3 max-w-[32ch] text-[#191919]/75">
                        Something else? Email <EmailLink subject="Unies: question" />.
                    </p>
                </div>
                <div className="flex flex-col gap-8">
                    {GROUPS.map((group) => (
                        <div key={group.title}>
                            <h3 className="text-lg font-semibold text-[#191919]">{group.title}</h3>
                            <Accordion type="single" collapsible className="mt-1">
                                {group.items.map((item) => (
                                    <AccordionItem key={item.question} value={item.question}>
                                        <AccordionTrigger className="cursor-pointer text-base text-[#191919]">{item.question}</AccordionTrigger>
                                        <AccordionContent className="max-w-[68ch] text-[15px] leading-relaxed text-[#191919]/75">{item.answer}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
