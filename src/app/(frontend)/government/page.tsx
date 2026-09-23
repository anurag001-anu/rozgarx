import Link from "next/link";
import { Landmark, ArrowRight, Award, FileCheck, Briefcase, Key, BookOpen, GraduationCap, AlertCircle, Clock } from "lucide-react";
import { getPayload } from "@/lib/payload";

// A helper component for each "Box" (Result, Admit Card, etc)
function SarkariBox({ title, icon, updates, color = "bg-brand", viewAllLink = "#" }: { title: string, icon: React.ReactNode, updates: any[], color?: string, viewAllLink?: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      {/* Box Header */}
      <div className={`${color} text-white p-4 flex items-center justify-between`}>
        <h2 className="font-bold text-lg flex items-center gap-2">
          {icon}
          {title}
        </h2>
      </div>
      
      {/* Box Content - Scrollable if too many */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        {updates.length === 0 ? (
          <div className="text-center text-gray-400 py-8 text-sm">No updates available</div>
        ) : (
          <ul className="space-y-3">
            {updates.map((update) => (
              <li key={update.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                <Link 
                  href={update.link} 
                  target={update.link.startsWith('/jobs') ? "_self" : "_blank"}
                  rel={update.link.startsWith('/jobs') ? undefined : "noopener noreferrer"}
                  className={`group flex items-start gap-2 hover:underline transition-colors ${update.highlight ? 'text-rose-600 font-bold' : 'text-blue-700 font-medium hover:text-blue-900'}`}
                >
                  <ArrowRight size={14} className="shrink-0 mt-1 opacity-50 group-hover:opacity-100" />
                  <span className="leading-tight">{update.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* View More Footer */}
      <div className="bg-gray-50 border-t border-gray-100 p-3 text-center">
        <Link href={viewAllLink} className="text-sm font-bold text-gray-600 hover:text-brand transition-colors">
          View All {title}
        </Link>
      </div>
    </div>
  );
}

export default async function GovernmentHubPage() {
  const payload = await getPayload();

  // Fetch all SarkariUpdates, sort by newest
  const updatesRes = await payload.find({
    collection: "sarkari-updates" as any, // Cast to any to bypass payload type checking
    sort: "-createdAt",
    limit: 100, // fetch enough to populate all boxes
  });

  const updates = updatesRes.docs as unknown as any[]; // Cast documents

  // Fetch Actual Government Jobs
  const govtJobsRes = await payload.find({
    collection: "jobs",
    where: { type: { equals: "government" } },
    sort: "-createdAt",
    limit: 100,
  });
  const allGovtJobs = govtJobsRes.docs;

  // Filter Active Jobs & Calculate Closing Soon
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeGovtJobs = allGovtJobs.filter((job: any) => {
    if (job.status === 'Closed') return false;
    if (job.lastDate) {
      const lastDate = new Date(job.lastDate);
      if (lastDate < today) return false;
    }
    return true;
  });

  const closingSoonJobs = activeGovtJobs.filter((job: any) => {
    if (!job.lastDate) return false;
    const lastDate = new Date(job.lastDate);
    const diffDays = Math.ceil((lastDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays <= 3;
  }).sort((a: any, b: any) => new Date(a.lastDate).getTime() - new Date(b.lastDate).getTime());

  // Format for SarkariBox
  const formattedLatestJobs = activeGovtJobs.slice(0, 8).map((job: any) => ({
    id: job.id,
    title: job.title,
    link: `/jobs/government/${job.id}`,
    highlight: false
  }));

  const formattedClosingSoon = closingSoonJobs.slice(0, 8).map((job: any) => ({
    id: job.id,
    title: job.title,
    link: `/jobs/government/${job.id}`,
    highlight: true
  }));

  // Group sarkari-updates by category
  const results = updates.filter((u: any) => u.category === 'Result');
  const admitCards = updates.filter((u: any) => u.category === 'Admit Card');
  const answerKeys = updates.filter((u: any) => u.category === 'Answer Key');
  const syllabus = updates.filter((u: any) => u.category === 'Syllabus');
  const admissions = updates.filter((u: any) => u.category === 'Admission');
  const importants = updates.filter((u: any) => u.category === 'Important');

  // Dynamic Categories Logic
  const govtCategories = ['SSC', 'UPSC', 'Railway', 'Banking', 'Defence', 'Police', 'Teaching', 'State Government'];
  const categoryCounts = govtCategories.map(cat => ({
    name: cat,
    count: activeGovtJobs.filter((job: any) => job.govtCategory === cat).length
  })).filter(cat => cat.count > 0);

  return (
    <div className="bg-[#f0f4f8] min-h-screen pb-16">
      
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-10 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="container-custom max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full text-sm font-bold mb-4">
            <Landmark size={16} /> Official Government Updates
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Sarkari Result & Jobs Hub
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
            Your one-stop destination for the latest Government Jobs, Results, Admit Cards, and Admission notifications.
          </p>

          {/* Dynamic Categories */}
          {categoryCounts.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {categoryCounts.map(cat => (
                <Link 
                  key={cat.name} 
                  href={`/jobs?type=government&category=${encodeURIComponent(cat.name)}`}
                  className="group text-sm font-bold border border-gray-200 bg-white text-gray-700 hover:bg-brand hover:text-white hover:border-brand px-5 py-2.5 rounded-xl shadow-sm transition-all duration-300 flex items-center gap-2"
                >
                  {cat.name}
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-black tracking-wider group-hover:bg-white/20 group-hover:text-white transition-colors">
                    {cat.count}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Sarkari Grid */}
      <div className="container-custom max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Row 1: The Big 3 (Jobs focused) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SarkariBox 
            title="Latest Jobs" 
            icon={<Briefcase size={20} />} 
            updates={formattedLatestJobs} 
            color="bg-indigo-700" 
            viewAllLink="/jobs?type=government"
          />
          <SarkariBox 
            title="Closing Soon" 
            icon={<Clock size={20} />} 
            updates={formattedClosingSoon} 
            color="bg-rose-700" 
            viewAllLink="/jobs?type=government"
          />
          <SarkariBox 
            title="Result" 
            icon={<Award size={20} />} 
            updates={results} 
            color="bg-emerald-700" 
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SarkariBox 
            title="Admit Card" 
            icon={<FileCheck size={20} />} 
            updates={admitCards} 
            color="bg-teal-700" 
          />
          <SarkariBox 
            title="Answer Key" 
            icon={<Key size={20} />} 
            updates={answerKeys} 
            color="bg-amber-600" 
          />
          <SarkariBox 
            title="Syllabus" 
            icon={<BookOpen size={20} />} 
            updates={syllabus} 
            color="bg-slate-800" 
          />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SarkariBox 
            title="Admission" 
            icon={<GraduationCap size={20} />} 
            updates={admissions} 
            color="bg-cyan-700" 
          />
          <SarkariBox 
            title="Important" 
            icon={<AlertCircle size={20} />} 
            updates={importants} 
            color="bg-purple-700" 
          />
          
          <div className="bg-gradient-to-br from-brand to-brand-hover rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <Landmark size={48} className="text-white/40 mb-4 relative z-10" />
            <h3 className="text-2xl font-black text-white mb-2 relative z-10">RozgarX Government Hub</h3>
            <p className="text-white/80 font-medium max-w-lg relative z-10">
              We aggregate actual payload jobs and updates daily to ensure you have the fastest access to official government websites without any clutter.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
