'use client'

import { useState, useTransition } from 'react'
import { Bookmark } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toggleSaveJob } from '@/app/actions/savedJobs'

interface SaveJobButtonProps {
  jobId: string | number;
  initialIsSaved: boolean;
  className?: string;
  iconSize?: number;
}

export function SaveJobButton({ jobId, initialIsSaved, className = '', iconSize = 20 }: SaveJobButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card clicks if button is inside a Link

    if (isPending) return;

    // Optimistic UI update
    setIsSaved(!isSaved);

    startTransition(async () => {
      const result = await toggleSaveJob(jobId);
      
      if (!result.success) {
        // Revert optimistic update
        setIsSaved(isSaved);
        if (result.redirect) {
          router.push(result.redirect);
        } else {
          // Ideally show a toast here
          alert(result.error);
        }
      } else {
        // Update to actual server state just in case
        setIsSaved(result.saved!);
        // Optional: you can add a small toast notification here
        // alert(result.message);
      }
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`relative flex items-center justify-center transition-all ${
        isSaved ? 'text-brand' : 'text-gray-400 hover:text-gray-600'
      } ${className} ${isPending ? 'opacity-50 cursor-wait' : ''}`}
      aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
      title={isSaved ? 'Remove from saved jobs' : 'Save job'}
    >
      <Bookmark
        size={iconSize}
        className={`transition-all ${isSaved ? 'fill-current scale-110' : ''}`}
      />
    </button>
  );
}
