'use client';

import React, { useState } from 'react';
import { Filter } from 'lucide-react';

export default function MobileFilterToggle({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full mb-4 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold shadow-sm active:scale-[0.98] transition-transform"
      >
        <Filter size={18} />
        {isOpen ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Filter Content */}
      <div className={`${isOpen ? 'block mb-8' : 'hidden'} lg:block`}>
        {children}
      </div>
    </>
  );
}
