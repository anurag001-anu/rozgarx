"use client";

import { useState, useActionState, useEffect } from "react";
import { X, Send, AlertCircle, CheckCircle } from "lucide-react";
import { applyJobAction } from "@/app/actions/applications";

export default function ApplyModal({ jobId, jobTitle }: { jobId: string, jobTitle: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(applyJobAction, null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setSuccess(true);
      // Close modal after 2 seconds
      const timer = setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full md:w-auto bg-brand hover:bg-brand-hover text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-brand/20"
      >
        Apply Now
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Sent!</h3>
                <p className="text-gray-500">Your application for {jobTitle} has been successfully submitted.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Apply for Job</h3>
                <p className="text-gray-500 mb-6 font-medium">You are applying for <span className="text-brand font-bold">{jobTitle}</span></p>

                {state?.error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                    <p className="text-sm font-medium text-red-800">{state.error}</p>
                  </div>
                )}

                <form action={formAction} className="space-y-6">
                  <input type="hidden" name="jobId" value={jobId} />
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Cover Letter / Message to Employer *
                    </label>
                    <textarea 
                      name="coverLetter"
                      rows={5} 
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                      placeholder="Why are you a great fit for this role? Include a link to your resume or portfolio."
                      required
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={isPending}
                      className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand/20 disabled:opacity-50"
                    >
                      {isPending ? 'Submitting...' : (
                        <>Submit Application <Send size={18} /></>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
