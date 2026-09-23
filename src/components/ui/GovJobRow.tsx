import Link from "next/link";
import { Building2, MapPin, Briefcase, GraduationCap, Calendar, Users, AlertCircle, ChevronRight, Clock, Bookmark } from "lucide-react";
import { SaveJobButton } from "./SaveJobButton";

export default function GovJobRow({ job, isSaved = false }: { job: any, isSaved?: boolean }) {
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

  const isUrgent = displayStatus === 'Closing Soon';
  const isClosed = displayStatus === 'Closed';
  const isOpen = displayStatus === 'Open';

  return (
    <div className={`group bg-white rounded-2xl p-5 md:p-6 border ${isClosed ? 'border-gray-200 opacity-75' : 'border-gray-200 hover:border-brand/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'} transition-all duration-300 relative overflow-hidden`}>
      
      {/* Decorative hover gradient */}
      {!isClosed && <div className="absolute inset-0 bg-gradient-to-r from-brand/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />}
      
      {/* Accent Line on the left for New or Urgent jobs */}
      {(isOpen || isUrgent) && (
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${isUrgent ? 'bg-amber-500' : 'bg-emerald-500'}`} />
      )}
      {isClosed && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
      )}

      <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-start md:items-center justify-between relative z-10">
        
        <div className="flex items-start gap-4 md:gap-5 flex-1 w-full">
          {/* Mock Logo Box - Adds huge professional credibility */}
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 group-hover:border-brand/20 group-hover:bg-brand/5 transition-colors">
            <span className="text-xl font-black text-gray-400 group-hover:text-brand transition-colors">
              {job.organization ? job.organization.charAt(0) : '🏛️'}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                  isUrgent ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                  isClosed ? 'bg-red-50 text-red-600 border-red-200' : 
                  'bg-emerald-50 text-emerald-600 border-emerald-200'
                }`}>
                  {displayStatus}
                </span>
                <span className="text-sm font-semibold text-gray-500 truncate">
                  {job.organization}
                </span>
              </div>
              
              {/* Bookmark for Mobile */}
              <div className="md:hidden z-20 relative bg-gray-50 p-1.5 rounded-md hover:bg-brand/10 transition-colors">
                <SaveJobButton jobId={job.id} initialIsSaved={isSaved} iconSize={16} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-extrabold text-gray-900 mb-2.5 group-hover:text-brand transition-colors leading-tight">
              <Link href={`/jobs/government/${job.id}`} className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                {job.title}
              </Link>
            </h3>

            {/* Info Dots instead of big tags - very premium & clean */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Users size={16} className="text-gray-400" />
                <span>{job.vacancies || 'Not specified'} Posts</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300 hidden md:block" />
              <div className="flex items-center gap-1.5">
                <Briefcase size={16} className="text-gray-400" />
                <span className="truncate max-w-[200px]">{job.salary || 'As per rules'}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300 hidden md:block" />
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-gray-400" />
                <span className="truncate max-w-[150px]">{job.location}</span>
              </div>
            </div>
            
            {/* Qualification tag - standalone to stand out just enough */}
            <div className="mt-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-600 rounded-md border border-gray-200 text-xs font-semibold group-hover:bg-white group-hover:border-gray-300 transition-colors">
              <GraduationCap size={14} className="text-gray-400" />
              {job.qualification || 'Not Specified'}
            </div>
          </div>
        </div>

        {/* Right side Action area */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0">
          <div className="flex flex-row items-center gap-4 md:items-end md:flex-col">
            <div className="hidden md:flex bg-gray-50 hover:bg-brand/10 p-2 rounded-lg transition-colors z-20 relative">
              <SaveJobButton jobId={job.id} initialIsSaved={isSaved} iconSize={18} />
            </div>
            <div className="text-left md:text-right">
              <div className={`flex items-center md:justify-end gap-1.5 text-xs font-bold uppercase tracking-wider mb-1 ${isUrgent ? 'text-amber-500' : isClosed ? 'text-red-500' : 'text-gray-400'}`}>
                <Clock size={13} />
                {isClosed ? 'Expired' : isUrgent ? 'Closing Soon' : 'Last Date'}
              </div>
              <p className="font-extrabold text-gray-900 text-[15px]">
                {job.lastDate ? new Date(job.lastDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>
          
          <Link href={`/jobs/government/${job.id}`} className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 font-bold rounded-xl transition-all duration-300 w-full md:w-auto z-20 relative ${isClosed ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white group-hover:bg-brand group-hover:shadow-lg group-hover:shadow-brand/25'}`}>
            {isClosed ? 'Closed' : 'View Details'}
            {!isClosed && <ChevronRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />}
          </Link>
        </div>

      </div>
    </div>
  );
}
