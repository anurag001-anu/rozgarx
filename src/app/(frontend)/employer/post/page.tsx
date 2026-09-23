"use client";

import { Briefcase, Building2, MapPin, DollarSign, ListChecks, AlertCircle } from "lucide-react";
import { useActionState, useEffect } from "react";
import { postJobAction } from "@/app/actions/jobs";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const [state, formAction, isPending] = useActionState(postJobAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push('/employer');
    }
  }, [state, router]);

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12">
      <div className="container-custom max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Post a New Job</h1>
          <p className="text-gray-600">Fill out the details below to publish your job opening to thousands of candidates.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          
          {state?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <p className="text-sm font-medium text-red-800">{state.error}</p>
            </div>
          )}

          <form className="space-y-8" action={formAction}>
            
            {/* Basic Info */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                <Briefcase size={20} className="text-brand" /> Basic Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Job Title *</label>
                  <input type="text" name="title" placeholder="e.g. Senior Product Designer" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Job Type *</label>
                    <select name="jobType" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand text-gray-700" required>
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Work Mode *</label>
                    <select name="workMode" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand text-gray-700" required>
                      <option>On-site</option>
                      <option>Hybrid</option>
                      <option>Remote</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Location *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                      <input type="text" name="location" placeholder="e.g. New Delhi" className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Experience Level *</label>
                    <input type="text" name="experience" placeholder="e.g. 2-5 Years" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" required />
                  </div>
                </div>
              </div>
            </section>

            {/* Compensation */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                <DollarSign size={20} className="text-brand" /> Compensation
              </h2>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Salary Range</label>
                <input type="text" name="salary" placeholder="e.g. ₹8,00,000 - ₹12,00,000" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                <ListChecks size={20} className="text-brand" /> Job Description
              </h2>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Detailed Description *</label>
                <textarea name="description" rows={6} placeholder="Describe the responsibilities, requirements, and benefits..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" required></textarea>
              </div>
            </section>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-4">
              <button type="button" onClick={() => router.back()} className="text-gray-500 font-bold hover:text-gray-900 transition-colors">Cancel</button>
              <button 
                type="submit" 
                disabled={isPending}
                className="bg-brand hover:bg-brand-hover text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-brand/20 disabled:opacity-50"
              >
                {isPending ? 'Publishing...' : 'Publish Job'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
