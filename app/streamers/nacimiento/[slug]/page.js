import { notFound } from 'next/navigation';
import { Detalle, metaDetalle } from '../../../components/AgrupacionUI';
import { gruposDe } from '../../../../lib/agrupaciones';

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return gruposDe('nacimiento').map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!gruposDe('nacimiento').some((g) => g.slug === slug)) return {};
  return metaDetalle('nacimiento', slug);
}

export default async function Page({ params }) {
  const { slug } = await params;
  if (!gruposDe('nacimiento').some((g) => g.slug === slug)) notFound();
  return <Detalle tipo="nacimiento" slug={slug} />;
}
