import { Hub, metaHub } from '../../components/AgrupacionUI';

export const metadata = metaHub('nacimiento');

export default function Page() {
  return <Hub tipo="nacimiento" />;
}
