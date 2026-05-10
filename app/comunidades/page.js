import { redirect } from 'next/navigation';

export const metadata = {
  robots: { index: false, follow: true },
  title: 'Comunidades | Streamdle',
};

export default function ComunidadesPage() {
  redirect('/comunidades/top-globales');
}
