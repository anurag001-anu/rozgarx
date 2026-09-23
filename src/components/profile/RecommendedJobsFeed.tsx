'use client';

import React, { useState, useEffect } from 'react';
import GovJobRow from '@/components/ui/GovJobRow';
import PrivateJobRow from '@/components/ui/PrivateJobRow';
import { Sparkles, RefreshCw, AlertTriangle, Briefcase, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Recommendation {
  job: any;
  reason: string;
}

interface RecommendedResponse {
  recommendations: Recommendation[];
  hasSufficientSignals: boolean;
  error?: string;
}

export default function RecommendedJobsFeed() {
  const [data, setData] = useState<RecommendedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/jobs/recommended', {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch recommendations');
      }
      
      setData(json);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 bg-gray-100 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                <div className="h-4 w-1/4 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-center">
        <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
        <h3 className="text-xl font-bold text-red-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-red-600 mb-6 max-w-md mx-auto">{error}</p>
        <button 
          onClick={fetchRecommendations}
          className="inline-flex items-center gap-2 bg-white text-red-600 hover:bg-red-50 border border-red-200 font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm"
        >
          <RefreshCw size={18} /> Try Again
        </button>
      </div>
    );
  }

  if (!data || !data.recommendations || data.recommendations.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-gray-200 shadow-sm text-center">
        <div className="w-20 h-20 bg-brand/5 text-brand rounded-full flex items-center justify-center mx-auto mb-5">
          <Briefcase size={36} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No recommendations yet</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">We don't have enough active jobs matching your profile right now. Check back later or browse all jobs.</p>
        <Link href="/jobs" className="inline-block bg-brand hover:bg-brand-hover text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg">
          Browse All Jobs
        </Link>
      </div>
    );
  }

  const title = data.hasSufficientSignals ? "Recommended for You" : "Fresh Jobs You May Like";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center">
          <Sparkles size={20} className={data.hasSufficientSignals ? "text-brand" : "text-gray-400"} />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">{title}</h2>
      </div>

      <div className="space-y-4">
        {data.recommendations.map((rec, index) => (
          <div key={"rec-" + rec.job.id + "-" + index} className="relative">
            {/* Wrapper Reason Badge */}
            <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/5 text-brand-dark rounded-full text-xs font-bold border border-brand/10 shadow-sm ml-2">
              <Sparkles size={12} className="text-brand" />
              {rec.reason}
            </div>
            
            {/* Untouched Job Component */}
            {rec.job.type === 'government' ? (
              <GovJobRow job={rec.job} isSaved={false} />
            ) : (
              <PrivateJobRow job={rec.job} isSaved={false} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
