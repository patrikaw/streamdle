import { notFound } from 'next/navigation';
import { ClipsPagina, metaClips, PERIODOS } from '../../components/ClipsUI';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PERIODOS).map((periodo) => ({ periodo }));
}

export async function generateMetadata({ params }) {
  const { periodo } = await params;
  return PERIODOS[periodo] ? metaClips('clips', periodo) : {};
}

export default async function Page({ params }) {
  const { periodo } = await params;
  if (!PERIODOS[periodo]) notFound();
  return <ClipsPagina tipo="clips" periodo={periodo} />;
}
