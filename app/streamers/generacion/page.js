import { Hub, metaHub } from '../../components/AgrupacionUI';

export const metadata = metaHub('generacion');

export default function Page() {
  return <Hub tipo="generacion" />;
}
