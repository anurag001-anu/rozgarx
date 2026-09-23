import Link from "next/link";
import { Building2, MapPin, Briefcase, Clock, Bookmark, IndianRupee, ChevronRight } from "lucide-react";
import { SaveJobButton } from "./SaveJobButton";

export default function PrivateJobRow({ job, isSaved = false }: { job: any, isSaved?: boolean }) {
  // Simple heuristic for hot jobs (format payload createdAt to string if needed)
  const postedDate = job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently';
  const isHot = typeof postedDate === 'string' && (postedDate.toLowerCase().includes('hour') || postedDate.toLowerCase().includes('today'));

  // Determine status dynamically
  let displayStatus = job.status || 'Open';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (job.lastDate) {
    const lastDate = new Date(job.lastDate);
    const diffDays = Math.ceil((lastDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) {
      displayStatus = 'Closed';
    } else if (diffDays <= 3) {
      displayStatus = 'Closing Soon';
    }
  }

  // Allow manual override if it's explicitly set to Closed in DB
  if (job.status === 'Closed') {
    displayStatus = 'Closed';
  }

  const isClosed = displayStatus === 'Closed';

  return (
    <div className={`group bg-white rounded-2xl p-5 md:p-6 border ${isClosed ? 'border-gray-200 opacity-75' : 'border-gray-200 hover:border-brand/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'} transition-all duration-300 relative overflow-hidden`}>
      
      {/* Decorative hover gradient */}
      {!isClosed && <div className="absolute inset-0 bg-gradient-to-r from-brand/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />}
      
      {/* Accent Line on the left for Hot jobs */}
      {isHot && !isClosed && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand" />
      )}
      {isClosed && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
      )}

      <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-start md:items-center justify-between relative z-10">
        
        <div className="flex items-start gap-4 md:gap-5 flex-1 w-full">
          {/* Mock Logo Box - Adds professional credibility */}
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 group-hover:border-brand/20 group-hover:bg-brand/5 transition-colors">
            <span className="text-xl font-black text-gray-400 group-hover:text-brand transition-colors">
              {job.company && typeof job.company === 'object' && job.company.name ? job.company.name.charAt(0) : '🏢'}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Top row: Tags and Company */}
            <div className="flex items-center justify-between mb-1.5 gap-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                {isClosed ? (
                  <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded text-[10px] font-bold tracking-wider uppercase">
                    Closed
                  </span>
                ) : (
                  <>
                    <span className="px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-200 rounded text-[10px] font-bold tracking-wider uppercase">
                      {job.jobType || 'Full Time'}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[10px] font-bold tracking-wider uppercase">
                      {job.workMode || 'Hybrid'}
                    </span>
                  </>
                )}
                <span className="text-sm font-semibold text-gray-500 truncate">
                  {job.company && typeof job.company === 'object' ? job.company.name : 'Unknown Company'}
                </span>
              </div>
              
              {/* Bookmark for Mobile */}
              <div className="md:hidden z-20 relative bg-gray-50 p-1.5 rounded-md hover:bg-brand/10 transition-colors">
                <SaveJobButton jobId={job.id} initialIsSaved={isSaved} iconSize={16} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-extrabold text-gray-900 mb-2.5 group-hover:text-brand transition-colors leading-tight pr-8 md:pr-0">
              <Link href={`/jobs/private/${job.id}`} className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                {job.title}
              </Link>
            </h3>

            {/* Info Dots instead of big tags - very premium & clean */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Briefcase size={16} className="text-gray-400" />
                <span>{job.experience || 'Fresher'}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300 hidden md:block" />
              <div className="flex items-center gap-1.5">
                <IndianRupee size={16} className="text-gray-400" />
                <span className="truncate max-w-[200px]">{job.salary || 'Not disclosed'}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300 hidden md:block" />
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-gray-400" />
                <span className="truncate max-w-[150px]">{job.location}</span>
              </div>
            </div>
            
            {/* Posted time */}
            <div className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400">
              <Clock size={13} />
              Posted {postedDate}
            </div>
          </div>
        </div>

        {/* Right side Action area */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0 self-stretch">
          
          <div className="hidden md:flex bg-gray-50 hover:bg-brand/10 p-2 rounded-lg transition-colors z-20 mb-auto relative">
            <SaveJobButton jobId={job.id} initialIsSaved={isSaved} iconSize={18} />
          </div>
          
          <Link href={job.applyUrl || `/jobs/private/${job.id}`} target={job.applyUrl ? "_blank" : "_self"} className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 font-bold rounded-xl transition-all duration-300 w-full md:w-auto z-20 relative mt-auto ${isClosed ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white group-hover:bg-brand group-hover:shadow-lg group-hover:shadow-brand/25'}`}>
            {isClosed ? 'Closed' : 'Apply Now'}
            {!isClosed && <ChevronRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />}
          </Link>
        </div>

      </div>
    </div>
  );
}
