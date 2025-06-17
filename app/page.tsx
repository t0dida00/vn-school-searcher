import MapClientWrapper from "./HOC/MapWrapper";
export const revalidate = 60; // ISR or 0 for pure SSG

export default async function HomePage() {
  const res = await fetch('http://localhost:3000/api/universities');
  if (!res.ok) throw new Error('Failed to fetch');
  const data = await res.json();

  return <MapClientWrapper data={data} />;
}