import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-brand text-white p-1.5 rounded-md">
                <Briefcase size={20} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl tracking-tight text-black">RozgarX</span>
            </Link>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              Find Government and Private career opportunities across India. Your trusted platform for job discovery.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <Link href="#" className="hover:text-brand transition-colors" title="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </Link>
              <Link href="#" className="hover:text-brand transition-colors" title="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </Link>
              <Link href="#" className="hover:text-brand transition-colors" title="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </Link>
              <Link href="#" className="hover:text-brand transition-colors" title="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col sm:flex-row gap-12 lg:gap-24">
            <div>
              <h4 className="font-bold text-black text-sm tracking-wider uppercase mb-4">For Job Seekers</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><Link href="/government" className="hover:text-brand transition-colors">Government Jobs</Link></li>
                <li><Link href="/jobs" className="hover:text-brand transition-colors">Private Jobs</Link></li>
                <li><Link href="/companies" className="hover:text-brand transition-colors">Browse Companies</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-black text-sm tracking-wider uppercase mb-4">Company & Legal</h4>
              <ul className="space-y-3 text-sm text-gray-500 mb-6">
                <li><Link href="/about" className="hover:text-brand transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-brand transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-brand transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-brand transition-colors">Terms of Service</Link></li>
                <li><Link href="/faq" className="hover:text-brand transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© 2026 RozgarX. All rights reserved.</p>
          <div className="flex items-center gap-1 text-xs">
            Made with <span className="text-brand">♥</span> in India
          </div>
        </div>
      </div>
    </footer>
  );
}
