"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, Search, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileGovOpen, setMobileGovOpen] = useState(false);
  const [mobilePrivateOpen, setMobilePrivateOpen] = useState(false);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch current user from Payload
    fetch('/api/users/me')
      .then(res => res.json())
      .then(data => {
        if (data && data.user) {
          setUser(data.user);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAction();
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
      <div className="container-custom h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-50 relative">
          <div className="bg-brand text-white p-1.5 rounded-md">
            <Briefcase size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight text-black">RozgarX</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center h-full gap-6 font-medium text-sm">
          <Link href="/jobs" className="text-black font-bold hover:text-brand transition-colors">
            Jobs
          </Link>
          
          {/* Government Menu */}
          <div className="group h-full flex items-center relative">
            <Link href="/government" className="text-black font-bold hover:text-brand transition-colors">
              Government
            </Link>
          </div>
          {/* Private Menu */}
          <div className="group h-full flex items-center relative">
            <Link href="/private" className="text-black font-bold hover:text-brand transition-colors">
              Private
            </Link>
          </div>
          <Link href="/companies" className="text-black font-bold hover:text-brand transition-colors">
            Companies
          </Link>
        </nav>

        {/* Actions Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/search" className="text-black border border-gray-200 hover:border-gray-300 rounded-md p-2 transition-colors flex items-center justify-center bg-white shadow-sm">
            <Search size={18} strokeWidth={2.5} />
            <span className="sr-only">Search</span>
          </Link>
          
          {user ? (
            <>
              {user.role === 'employer' ? (
                <Link href="/employer" className="text-black font-bold hover:text-brand transition-colors px-3 py-2 text-sm">
                  Dashboard
                </Link>
              ) : (
                <Link href="/profile" className="text-black font-bold hover:text-brand transition-colors px-3 py-2 text-sm">
                  My Profile
                </Link>
              )}
              <button onClick={handleLogout} className="text-gray-500 font-bold hover:text-red-500 transition-colors px-3 py-2 text-sm">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="flex items-center gap-2 border border-gray-200 hover:border-gray-300 rounded-md px-4 py-2 font-bold text-sm text-black bg-white shadow-sm transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Login
            </Link>
          )}

        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 -mr-2 text-black z-50 relative"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-xl overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="p-4 flex flex-col gap-2">
            
            <Link href="/jobs" className="px-4 py-3 font-bold text-black border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Jobs</Link>
            <Link href="/government" className="px-4 py-3 font-bold text-black border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Government Jobs</Link>
            <Link href="/private" className="px-4 py-3 font-bold text-black border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Private Jobs</Link>
            <Link href="/companies" className="px-4 py-3 font-bold text-black border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Companies</Link>
            
            <div className="p-4 flex flex-col gap-3 mt-4">
              {user ? (
                <>
                  <Link href={user.role === 'employer' ? '/employer' : '/profile'} className="w-full text-center py-3 border border-gray-300 rounded font-bold text-black" onClick={() => setMobileMenuOpen(false)}>
                    {user.role === 'employer' ? 'Dashboard' : 'My Profile'}
                  </Link>
                  <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="w-full text-center py-3 bg-gray-100 rounded font-bold text-red-500">
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="w-full text-center py-3 border border-gray-300 rounded font-bold text-black" onClick={() => setMobileMenuOpen(false)}>
                  Login / Register
                </Link>
              )}

            </div>
            
          </div>
        </div>
      )}
    </header>
  );
}
