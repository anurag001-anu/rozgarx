"use client";

import { useState } from "react";
import GovJobRow from "../ui/GovJobRow";
import PrivateJobRow from "../ui/PrivateJobRow";
import { ArrowRight, Landmark, Briefcase } from "lucide-react";
import Link from "next/link";

export default function JobSwitcher({ initialGovtJobs = [], initialPrivateJobs = [] }: { initialGovtJobs?: any[], initialPrivateJobs?: any[] }) {
  const [activeTab, setActiveTab] = useState<'GOV' | 'PRIVATE'>('GOV');

  return (
    <div className="w-full">
      {/* Premium Segmented Switch */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-white/60 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-gray-100 relative">
          <button
            onClick={() => setActiveTab('GOV')}
            className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 z-10 ${
              activeTab === 'GOV' 
                ? 'bg-brand text-white shadow-md shadow-brand/20 scale-[1.02]' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
            }`}
          >
            <Landmark size={18} /> Government Jobs
          </button>
          <button
            onClick={() => setActiveTab('PRIVATE')}
            className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 z-10 ${
              activeTab === 'PRIVATE' 
                ? 'bg-brand text-white shadow-md shadow-brand/20 scale-[1.02]' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
            }`}
          >
            <Briefcase size={18} /> Private Jobs
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-5xl mx-auto">
        
        {/* Categories specific to active tab */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {activeTab === 'GOV' ? (
            ['SSC', 'UPSC', 'Railway', 'Banking', 'Defence', 'Police', 'Teaching', 'State Govt'].map(cat => (
              <button key={cat} className="text-sm font-semibold border border-gray-100 bg-white/70 backdrop-blur-sm text-gray-600 hover:bg-brand hover:text-white hover:border-brand hover:-translate-y-0.5 px-5 py-2 rounded-xl shadow-sm transition-all duration-300">
                {cat}
              </button>
            ))
          ) : (
            ['IT & Software', 'Engineering', 'Finance', 'Sales', 'Marketing', 'Healthcare', 'BPO', 'Internship', 'Remote'].map(cat => (
              <button key={cat} className="text-sm font-semibold border border-gray-100 bg-white/70 backdrop-blur-sm text-gray-600 hover:bg-brand hover:text-white hover:border-brand hover:-translate-y-0.5 px-5 py-2 rounded-xl shadow-sm transition-all duration-300">
                {cat}
              </button>
            ))
          )}
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-4">
          {activeTab === 'GOV' 
            ? initialGovtJobs.map(job => <GovJobRow key={job.id} job={job} />)
            : initialPrivateJobs.map(job => <PrivateJobRow key={job.id} job={job} />)
          }
        </div>

        <div className="mt-12 text-center">
          <Link 
            href={activeTab === 'GOV' ? '/government' : '/private'}
            className="group inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-900 font-bold hover:border-brand hover:text-brand hover:shadow-lg hover:shadow-brand/10 hover:-translate-y-1 transition-all duration-300 px-8 py-3.5 rounded-2xl"
          >
            View all {activeTab === 'GOV' ? 'Government' : 'Private'} Jobs 
            <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>

      </div>
    </div>
  );
}
