import MapClientWrapper from "../HOC/MapWrapper";
import axios from 'axios';

export const revalidate = 60; // ISR or 0 for pure SSG

export default async function HomePage() {
    let data = null;
    let error = null;
    const baseUrl = process.env.NEXT_INTERNAL_BASE_URL || 'http://localhost:3000';

    try {
        const res = await fetch(`${baseUrl}/api/universities`);
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

    return <MapClientWrapper data={data} error={error} />;
}