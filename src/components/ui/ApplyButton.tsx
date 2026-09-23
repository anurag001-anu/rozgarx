'use client';

import { LinkIcon } from 'lucide-react';

export default function ApplyButton({ jobId, applyUrl, className = '' }: { jobId: string, applyUrl: string | null | undefined, className?: string }) {
  const handleClick = (e: React.MouseEvent) => {
    if (!applyUrl) {
      e.preventDefault();
      return;
    }
    
    // Non-blocking tracking request
    try {
      fetch(`/api/jobs/${jobId}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(err => console.error("Tracking failed:", err));
    } catch(err) {
      // Ignore sync errors, never block redirect
    }
  };

  if (!applyUrl) {
    return (
      <button disabled className={`w-full md:w-auto bg-gray-200 text-gray-600 font-bold py-3 px-4 rounded-md cursor-not-allowed ${className}`}>
        Link Unavailable
      </button>
    );
  }

  return (
    <a 
      href={applyUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      onClick={handleClick}
      className={`w-full bg-brand text-white font-bold py-3 px-4 rounded-md hover:bg-brand-hover transition-colors shadow-sm flex items-center justify-center gap-2 ${className}`}
    >
      Apply Now <LinkIcon size={18} />
    </a>
  );
}
