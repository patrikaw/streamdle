import { Hub, metaHub } from '../../components/AgrupacionUI';

export const metadata = metaHub('personalidad');

export default function Page() {
  return <Hub tipo="personalidad" />;
}
