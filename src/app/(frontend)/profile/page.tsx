import { cookies } from "next/headers";
import { getPayload } from "@/lib/payload";
import { redirect } from "next/navigation";
import { User, Briefcase, FileText, Settings, Clock, CheckCircle, Building2, Bookmark, Bell } from "lucide-react";
import Link from "next/link";
import GovJobRow from "@/components/ui/GovJobRow";
import PrivateJobRow from "@/components/ui/PrivateJobRow";
import JobAlertsManager from "@/components/profile/JobAlertsManager";
import RecommendedJobsFeed from "@/components/profile/RecommendedJobsFeed";
import { Sparkles } from "lucide-react";

export default async function CandidateProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const awaitedSearchParams = await searchParams;
  const activeTab = awaitedSearchParams?.tab === 'saved' ? 'saved' : awaitedSearchParams?.tab === 'alerts' ? 'alerts' : awaitedSearchParams?.tab === 'recommended' ? 'recommended' : 'applications';

  const cookieStore = await cookies();
  const token = cookieStore.get("payload-token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = await getPayload();
  const { user } = await payload.auth({
    headers: new Headers({
      Authorization: `JWT ${token}`
    })
  });

  if (!user || user.role !== "jobseeker") {
    redirect("/login");
  }

  // Fetch applications for this user
  const applicationsRes = await payload.find({
    collection: "applications" as any,
    where: {
      applicant: { equals: user.id }
    },
    depth: 2, // Fetch job details
    sort: "-createdAt"
  });

  const applications = applicationsRes.docs;

  // Fetch saved jobs for this user
  const savedJobsRes = await payload.find({
    collection: 'saved-jobs' as any,
    where: {
      user: { equals: user.id }
    },
    depth: 1,
    sort: '-createdAt'
  });

  const savedJobs = savedJobsRes.docs;

  // Fetch job alerts for this user
  const jobAlertsRes = await payload.find({
    collection: 'job-alerts' as any,
    where: {
      user: { equals: user.id }
    },
    sort: '-createdAt'
  });

  const jobAlerts = jobAlertsRes.docs;

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12">
      <div className="container-custom max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm text-center">
              <div className="w-24 h-24 bg-brand/10 text-brand rounded-full mx-auto flex items-center justify-center mb-4">
                <User size={40} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h2>
              <p className="text-gray-500 text-sm mb-4">{user.email}</p>
              <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-xl transition-colors text-sm border border-gray-200">
                Edit Profile
              </button>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-sm space-y-1">
              <Link href="/profile?tab=applications" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'applications' ? 'bg-brand/5 text-brand' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Briefcase size={20} /> My Applications
              </Link>
              <Link href="/profile?tab=saved" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'saved' ? 'bg-brand/5 text-brand' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Bookmark size={20} /> Saved Jobs
              </Link>
              <Link href="/profile?tab=alerts" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'alerts' ? 'bg-brand/5 text-brand' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Bell size={20} /> Job Alerts
              </Link>
              <Link href="/profile?tab=recommended" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'recommended' ? 'bg-brand/5 text-brand' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Sparkles size={20} className={activeTab === 'recommended' ? 'text-brand' : 'text-brand/60'} /> Recommended Jobs
              </Link>
              <Link href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium transition-colors">
                <Settings size={20} /> Settings
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {activeTab === 'saved' ? 'Saved Jobs' : activeTab === 'alerts' ? 'Job Alerts' : activeTab === 'recommended' ? '' : 'My Applications'}
            </h1>
            
            <div className="space-y-4">
              {activeTab === 'applications' && (
                applications.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-gray-200 shadow-sm text-center">
                    <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-500 mb-6">You haven't applied to any jobs. Start exploring opportunities!</p>
                    <Link href="/jobs" className="bg-brand hover:bg-brand-hover text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg">
                      Find Jobs
                    </Link>
                  </div>
                ) : (
                  applications.map((app: any) => (
                    <div key={app.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-brand/30 transition-colors">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand transition-colors">
                          {typeof app.job === 'object' ? app.job.title : 'Unknown Job'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2 font-medium">
                          <span className="flex items-center gap-1">
                            <Building2 size={16} /> 
                            {typeof app.job === 'object' && typeof app.job.company === 'object' ? app.job.company.name : 'Company'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={16} /> Applied on {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold ${
                          app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                          app.status === 'reviewed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          app.status === 'shortlisted' ? 'bg-green-50 text-green-700 border border-green-200' :
                          'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {app.status === 'shortlisted' ? <CheckCircle size={16} /> : <Clock size={16} />}
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))
                )
              )}

              {activeTab === 'saved' && (
                savedJobs.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-gray-200 shadow-sm text-center">
                    <Bookmark size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No saved jobs</h3>
                    <p className="text-gray-500 mb-6">You haven't saved any jobs yet.</p>
                    <Link href="/jobs" className="bg-brand hover:bg-brand-hover text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg">
                      Explore Jobs
                    </Link>
                  </div>
                ) : (
                  savedJobs.map((savedJob: any) => {
                    if (!savedJob.job || typeof savedJob.job !== 'object') {
                      return (
                        <div key={savedJob.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-center">
                          <p className="text-gray-500 font-medium">This job was removed by the employer.</p>
                        </div>
                      );
                    }
                    const job = savedJob.job;
                    return job.type === 'government' ? (
                      <GovJobRow key={job.id} job={job as any} isSaved={true} />
                    ) : (
                      <PrivateJobRow key={job.id} job={job as any} isSaved={true} />
                    );
                  })
                )
              )}

              {activeTab === 'alerts' && (
                <JobAlertsManager alerts={jobAlerts as any} />
              )}

              {activeTab === 'recommended' && (
                <RecommendedJobsFeed />
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
