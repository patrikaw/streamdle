import { notFound } from 'next/navigation';
import { Tendencias, metaTendencias } from '../../../../components/TendenciasUI';
import { periodosArchivo, REGIONES } from '../../../../../lib/tendencias';

export const dynamicParams = false;

export function generateStaticParams() {
  return periodosArchivo().flatMap((a) => REGIONES.filter((r) => r.slug).map((r) => ({ periodo: a.clave, region: r.slug })));
}

const valido = (periodo, region) => periodosArchivo().some((a) => a.clave === periodo) && REGIONES.some((r) => r.slug === region);

export async function generateMetadata({ params }) {
  const { periodo, region } = await params;
  return valido(periodo, region) ? metaTendencias(region, periodo) : {};
}

export default async function Page({ params }) {
  const { periodo, region } = await params;
  if (!valido(periodo, region)) notFound();
  return <Tendencias regionSlug={region} periodoClave={periodo} />;
}
