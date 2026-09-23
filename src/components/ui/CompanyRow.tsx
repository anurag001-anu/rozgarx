import Link from "next/link";
import { MapPin, Building2, ChevronRight, ShieldCheck } from "lucide-react";

export default function CompanyRow({ company }: { company: any }) {
  return (
    <div className="group bg-white rounded-2xl p-5 border border-gray-200 hover:border-brand/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden flex items-center justify-between gap-4">
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex items-center gap-4 relative z-10 w-full">
        {/* Mock Logo Box - Premium identity touch */}
        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 group-hover:border-brand/20 group-hover:bg-brand/5 transition-colors overflow-hidden">
          {company.logo && typeof company.logo === 'object' && company.logo.url ? (
            <img src={company.logo.url} alt={company.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-black text-gray-400 group-hover:text-brand transition-colors">
              {company.name.charAt(0)}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-extrabold text-gray-900 mb-1.5 group-hover:text-brand transition-colors flex items-center gap-2">
            <Link href={`/companies/${company.slug || company.id}`} className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <span className="truncate">{company.name}</span>
            </Link>
            {company.isVerified && (
              <span title="Verified Business Entity (Does not imply endorsement or hiring guarantee by RozgarX)" className="text-green-600 relative z-20">
                <ShieldCheck size={18} />
              </span>
            )}
          </h3>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 font-medium">
            <div className="flex items-center gap-1.5">
              <Building2 size={14} className="text-gray-400" />
              <span className="truncate">{company.industry}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-gray-400" />
              <span className="truncate">{company.location}</span>
            </div>
          </div>
        </div>

        {/* Action Badge */}
        <div className="shrink-0 relative z-20 pl-2">
          <Link 
            href={`/companies/${company.slug || company.id}`} 
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-100 text-gray-700 font-bold rounded-xl group-hover:bg-brand group-hover:border-brand group-hover:text-white transition-all duration-300 shadow-sm"
          >
            <span className="flex items-center gap-1">
              <span className="text-brand group-hover:text-white transition-colors">{company.openPositions || 'View'}</span> 
              <span className="font-semibold text-gray-500 group-hover:text-white/80 transition-colors">Jobs</span>
            </span>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-white opacity-70 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
