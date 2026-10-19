import MapClientWrapper from "../../HOC/MapWrapper";
import axios from 'axios';
import type { CountryCode } from "../../lib/countries";

// School data changes about twice a year; regenerate daily
export const revalidate = 86400;

export default async function HomePage({ params }: { params: Promise<{ country: string }> }) {
    // Validated by app/[country]/layout.tsx
    const country = (await params).country as CountryCode;
    let data = null;
    let error = null;
    const baseUrl = process.env.NEXT_INTERNAL_BASE_URL || 'http://localhost:3000';

    try {
        const res = await fetch(`${baseUrl}/api/universities?country=${country}`);
        data = await res.json();
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            console.log(err, 'Axios error');
            error = err.response?.data?.message || err.message || 'Axios error occurred';
        } else {
            console.log(err, 'Unexpected error');
            error = 'An unexpected error occurred';
        }
    }

    return <MapClientWrapper data={data} error={error} country={country} />;
}