import MapClientWrapper from "../HOC/MapWrapper";
import axios from 'axios';

export const revalidate = 60; // ISR or 0 for pure SSG

export default async function HomePage() {
    let data = null;
    let error = null;
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;
    try {
        const res = await axios.get(`${baseUrl}/api/universities`);
        data = res.data;
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            error = err.response?.data?.message || err.message || 'Axios error occurred';
        } else {
            error = 'An unexpected error occurred';
        }
    }

    return <MapClientWrapper data={data} error={error} />;
}