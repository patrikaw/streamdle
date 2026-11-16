import { redirect } from 'next/navigation';

export const metadata = { robots: { index: false, follow: true } };

export default function ClipsIndex() {
  redirect('/clips/hoy');
}
