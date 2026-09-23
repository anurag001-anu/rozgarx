import Link from 'next/link';
import { ArrowLeft, ExternalLink, Info } from 'lucide-react';
import { cookies } from 'next/headers';
import { getPayload } from '@/lib/payload';
import { redirect } from 'next/navigation';

export default async function ProfileAppliedJobsPage() {
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

  if (!user) {
    redirect("/login");
  }

  const appsRes = await payload.find({
    collection: 'applications' as any,
    where: {
      applicant: { equals: user.id }
    },
    depth: 1,
    sort: '-createdAt'
  });

  const applications = appsRes.docs;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/profile" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-brand mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2"/> Back to Profile
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Track Applied Jobs</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 items-start mb-8 text-blue-800">
          <Info size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm font-medium">
            RozgarX only tracks that you marked this job as applied. We cannot confirm whether your application was successfully submitted on the official portal.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-200 shadow-sm text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-500 mb-6">You haven't tracked any applications. When you apply for jobs, they will appear here.</p>
            <Link href="/jobs" className="bg-brand text-white font-bold px-6 py-3 rounded-lg hover:bg-brand-hover transition-colors">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app: any) => {
              const job = typeof app.job === 'object' ? app.job : null;
              return (
                <div key={app.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-gray-500 mb-1">
                      Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {job ? job.title : 'Unknown Job'}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1">
                      {job ? (job.type === 'government' ? job.organization : (typeof job.company === 'object' ? job.company?.name : 'Private Company')) : ''}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full flex items-center gap-1">
                      Applied on Official Portal
                    </span>
                    {job && (
                      <Link href={job.type === 'government' ? `/jobs/${job.id}` : `/jobs/private/${job.id}`} className="text-sm text-brand font-bold hover:underline flex items-center gap-1">
                        View Job Details <ExternalLink size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
