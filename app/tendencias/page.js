import { Tendencias, metaTendencias } from '../components/TendenciasUI';

export const revalidate = 86400;
export const metadata = metaTendencias('');

export default function Page() {
  return <Tendencias regionSlug="" />;
}
