import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function GovernmentAdmitCardPage() {
  return (
    <div className="container-custom py-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="inline-block px-3 py-1 mb-6 text-sm font-bold tracking-wider text-brand bg-brand/10 rounded-full uppercase">
        Coming Soon
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
        Government   Admit Card
      </h1>
      <p className="text-gray-500 mb-10 max-w-lg mx-auto text-lg">
        We are currently building this section of the platform. Check back soon for updates.
      </p>
      <Link href="/" className="inline-flex items-center gap-2 text-black font-medium hover:text-brand transition-colors">
        <ArrowLeft size={16} /> Back to Homepage
      </Link>
    </div>
  );
}
