import { notFound } from 'next/navigation';
import { Tendencias, metaTendencias } from '../../../components/TendenciasUI';
import { periodosArchivo } from '../../../../lib/tendencias';

export const dynamicParams = false;

export function generateStaticParams() {
  return periodosArchivo().map((a) => ({ periodo: a.clave }));
}

export async function generateMetadata({ params }) {
  const { periodo } = await params;
  if (!periodosArchivo().some((a) => a.clave === periodo)) return {};
  return metaTendencias('', periodo);
}

export default async function Page({ params }) {
  const { periodo } = await params;
  if (!periodosArchivo().some((a) => a.clave === periodo)) notFound();
  return <Tendencias regionSlug="" periodoClave={periodo} />;
}
