export const metadata = {
  robots: { index: false, follow: true },
  title: 'Eventos | Streamdle',
};

import { redirect } from 'next/navigation';

export default function EventosPage() {
  redirect('/eventos/la-velada-del-ano-6');
}
