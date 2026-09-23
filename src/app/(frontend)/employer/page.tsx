import Link from "next/link";
import { Briefcase, Users, Plus, BarChart2, MessageSquare, Settings } from "lucide-react";
import { cookies } from "next/headers";
import { getPayload } from "@/lib/payload";
import { redirect } from "next/navigation";
import PrivateJobRow from "@/components/ui/PrivateJobRow";

export default async function EmployerDashboardPage() {
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

  if (!user || user.role !== "employer") {
    redirect("/login");
  }

  // Fetch jobs owned by this employer
  const jobsRes = await payload.find({
    collection: "jobs",
    where: {
      owner: { equals: user.id }
    },
    sort: "-createdAt"
  });

  const myJobs = jobsRes.docs;
  const myJobIds = myJobs.map(job => job.id);

  if (myJobIds.length > 0) {
    // Analytics/Applications tracking removed to align with Step 10 locked model
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-black text-xl tracking-tight text-gray-900">RozgarX <span className="text-brand">Employer</span></h2>
        </div>
        <div className="p-4 space-y-1">
          <Link href="/employer" className="flex items-center gap-3 bg-brand/10 text-brand px-4 py-3 rounded-xl font-bold">
            <BarChart2 size={20} /> Dashboard
          </Link>
          <Link href="/employer/post" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium transition-colors">
            <Plus size={20} /> Post a Job
          </Link>
          <Link href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium transition-colors">
            <Briefcase size={20} /> Manage Jobs
          </Link>
          <Link href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium transition-colors">
            <MessageSquare size={20} /> Messages
          </Link>
          <Link href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium transition-colors mt-8">
            <Settings size={20} /> Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name || 'HR Team'}</h1>
            <p className="text-gray-500">Here's what's happening with your job postings today.</p>
          </div>
          <Link href="/employer/post" className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center gap-2 shrink-0">
            <Plus size={20} /> Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-500 text-sm">Active Jobs</h3>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Briefcase size={20} /></div>
            </div>
            <div className="text-3xl font-black text-gray-900">{myJobs.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm opacity-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-500 text-sm">Profile Views</h3>
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><BarChart2 size={20} /></div>
            </div>
            <div className="text-3xl font-black text-gray-900">0</div>
          </div>
        </div>



        {/* My Jobs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-lg">My Job Postings</h2>
          </div>
          <div className="p-6 bg-gray-50">
            {myJobs.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="mb-4">You haven't posted any jobs yet.</p>
                <Link href="/employer/post" className="text-brand font-bold hover:underline">Post your first job</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {myJobs.map((job) => (
                  <PrivateJobRow key={job.id} job={job as any} />
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
