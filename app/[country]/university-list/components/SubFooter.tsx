"use client";
import { CircleHelp, Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useCountryConfig } from '../../../utils/useCountry';
import { CONTACT_EMAIL } from '../../../lib/contact';

const SubFooter: React.FC = () => {
    const { brand, name } = useCountryConfig();
    return (
        <div className="grid gap-6 mb-24 sm:grid-cols-3">
            <div>
                <div className='text-lg font-semibold mb-2'>About us</div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {brand} is designed to help students easily find information about universities in {name}.
                </p>
            </div>
            <div>
                <div className='text-lg font-semibold mb-2'>Contact</div>
                <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4 break-all"
                >
                    <Mail className="size-4 shrink-0" />
                    {CONTACT_EMAIL}
                </a>
            </div>
            <div>
                <div className='text-lg font-semibold mb-2'>Links</div>
                <Link
                    href="/#faq"
                    className="mb-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
                >
                    <CircleHelp className="size-4 shrink-0" />
                    Questions &amp; answers
                </Link>
                <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${brand} feedback`)}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
                >
                    <MessageSquare className="size-4 shrink-0" />
                    Feedback for the website
                </a>
            </div>
        </div>
    );
};

export default SubFooter;
