import { notFound } from 'next/navigation';
import { Tendencias, metaTendencias } from '../../components/TendenciasUI';
import { REGIONES } from '../../../lib/tendencias';

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return REGIONES.filter((r) => r.slug).map((r) => ({ region: r.slug }));
}

export async function generateMetadata({ params }) {
  const { region } = await params;
  if (!REGIONES.some((r) => r.slug === region)) return {};
  return metaTendencias(region);
}

export default async function Page({ params }) {
  const { region } = await params;
  if (!REGIONES.some((r) => r.slug === region)) notFound();
  return <Tendencias regionSlug={region} />;
}
