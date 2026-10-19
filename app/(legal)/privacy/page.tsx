import type { Metadata } from "next";
import LegalPage, { ContactLink } from "../LegalPage";

export const metadata: Metadata = {
    title: "Privacy policy",
    description: "What Unies (FinUnies, VieUnies) does, and doesn't do, with your data.",
    alternates: { canonical: "/privacy" },
};

// Keep this in step with the code: if analytics, cookies, forms or new third-party services are added,
// this page has to say so (the "Report a problem" form is described under "If you report a problem")
export default function PrivacyPage() {
    return (
        <LegalPage
            title="Privacy policy"
            updated="19 October 2026"
            intro={
                <>
                    Unies, including FinUnies and VieUnies (&quot;the site&quot;), is an independent project run by Khoa Dinh to
                    help students find universities abroad. We built the site to work without knowing who you are: there
                    are no accounts, no sign-up forms and no advertising.
                </>
            }
        >
            <section>
                <h2>What we don&apos;t collect</h2>
                <ul>
                    <li>We don&apos;t ask for your name, email address or any other personal details to use the site.</li>
                    <li>We don&apos;t use advertising or cross-site tracking tools, and we don&apos;t set cookies.</li>
                    <li>We don&apos;t sell or share personal data with anyone.</li>
                </ul>
            </section>

            <section>
                <h2>Visitor statistics</h2>
                <p>
                    We use <strong>Vercel Web Analytics</strong> to count visits, so we can see which pages and countries
                    people use and improve the site. For each page view it records the page address, the site you came from,
                    your country and your browser, operating system and device type. It doesn&apos;t use cookies and
                    doesn&apos;t identify you: visitors are told apart only by an anonymous code that changes every day, and
                    we only ever see totals (<a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer">how Vercel Web Analytics handles data</a>).
                </p>
            </section>

            <section>
                <h2>What stays in your browser</h2>
                <p>
                    To make the site faster and to remember your choices, your browser keeps two small entries in its local
                    storage on your own device:
                </p>
                <ul>
                    <li>
                        <strong>Your shortlist</strong>: the schools you save with the heart button.
                    </li>
                    <li>
                        <strong>A copy of the school list</strong>, so pages load instantly. It refreshes itself after 7 days, or
                        sooner when we update the data.
                    </li>
                </ul>
                <p>
                    This information is never sent to us. You can delete it at any time by clearing this site&apos;s data in
                    your browser settings; your shortlist will then be empty.
                </p>
            </section>

            <section>
                <h2>Services that see your requests</h2>
                <p>Like any website, the site relies on a few outside services. When your browser connects to them, they receive technical information such as your IP address and browser type:</p>
                <ul>
                    <li>
                        <strong>Vercel</strong> hosts the site, keeps short-lived server logs to deliver pages and protect
                        them from abuse, and provides the visitor statistics above (<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel privacy policy</a>).
                    </li>
                    <li>
                        <strong>Mapbox</strong> provides the maps and the globe. Map pages load map tiles from Mapbox, which
                        may also collect anonymous usage statistics (<a href="https://www.mapbox.com/legal/privacy" target="_blank" rel="noopener noreferrer">Mapbox privacy policy</a>).
                    </li>
                    <li>
                        <strong>School logos</strong> load from the schools&apos; websites, Wikimedia and a content delivery
                        network, so those servers see the request for the image.
                    </li>
                </ul>
                <p>
                    Links to school websites, Google Maps directions and other sites take you to services with their own
                    privacy policies.
                </p>
            </section>

            <section>
                <h2>If you report a problem</h2>
                <p>
                    Each school&apos;s details have a &quot;Report a problem&quot; form for wrong logos, locations or
                    information. When you send it, we store the school, the reason you picked, your optional note and the
                    date, so we can check and fix the data. We don&apos;t store your IP address, browser details or anything
                    else about you with the report, so please don&apos;t put personal details in the note. We keep reports
                    until the data has been checked.
                </p>
            </section>

            <section>
                <h2>If you email us</h2>
                <p>
                    If you write to <ContactLink subject="Privacy question" />, we use your message and email address only to
                    reply and, for corrections, to fix the data. We don&apos;t add you to any mailing list, and we delete the
                    conversation when it&apos;s no longer needed.
                </p>
            </section>

            <section>
                <h2>Your rights</h2>
                <p>
                    If you are in the EU or EEA, the GDPR gives you the right to ask what personal data we hold about you, to
                    have it corrected or deleted, and to complain to your data protection authority. As the site keeps no
                    personal data apart from emails you send us (and anything you choose to write in a report note), the quickest way to exercise these rights is to email{" "}
                    <ContactLink subject="Privacy request" />.
                </p>
            </section>

            <section>
                <h2>Changes</h2>
                <p>If the way the site handles data changes, we&apos;ll update this page and the date at the top.</p>
            </section>
        </LegalPage>
    );
}
