import Link from "next/link";
import { Search, MapPin, Briefcase, ChevronRight, Star, Building2, ExternalLink, IndianRupee } from "lucide-react";
import { getPayload } from "@/lib/payload";

export default async function PrivateHubPage() {
  const payload = await getPayload();

  // Fetch top companies
  const companiesRes = await payload.find({
    collection: "companies",
    limit: 8,
  });
  const companies = companiesRes.docs;

  // Fetch all Private Jobs for dynamic filtering and counting
  const allJobsRes = await payload.find({
    collection: "jobs",
    where: { type: { equals: "private" } },
    sort: "-createdAt",
    limit: 200, // Fetch enough to calculate category counts accurately
  });
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeJobs = allJobsRes.docs.filter((job: any) => {
    if (job.status === 'Closed') return false;
    if (job.lastDate) {
      const lastDate = new Date(job.lastDate);
      if (lastDate < today) return false;
    }
    return true;
  });

  const displayJobs = activeJobs.slice(0, 10); // Display top 10 active jobs

  const privateCategories = [
    { name: 'IT & Software', icon: '💻' },
    { name: 'Engineering', icon: '⚙️' },
    { name: 'Finance', icon: '💰' },
    { name: 'Sales', icon: '🎯' },
    { name: 'Marketing', icon: '📈' },
    { name: 'Healthcare', icon: '🏥' },
    { name: 'BPO', icon: '🎧' },
    { name: 'Internship', icon: '🎓' },
    { name: 'Remote', icon: '🏠' }
  ];

  const popularRoles = privateCategories.map(cat => ({
    ...cat,
    count: activeJobs.filter((job: any) => job.privateCategory === cat.name || (cat.name === 'Remote' && job.workMode === 'Remote')).length
  })).filter(cat => cat.count > 0);

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container-custom max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">
            Find your <span className="text-brand">dream job</span> now
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            <span className="font-bold text-brand">{activeJobs.length}</span> active jobs for you to explore
          </p>

          {/* Mega Search Bar */}
          <form action="/jobs" method="GET" className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 rounded-full flex flex-col md:flex-row items-center p-2 max-w-4xl mx-auto">
            <input type="hidden" name="type" value="private" />
            <div className="flex-1 flex items-center px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-gray-200 w-full md:w-auto">
              <Search className="text-gray-400 mr-3" size={20} />
              <input 
                type="text" 
                name="q"
                placeholder="Enter skills / designations / companies" 
                className="w-full focus:outline-none text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>
            
            <div className="flex-1 flex items-center px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-gray-200 w-full md:w-auto">
              <MapPin className="text-gray-400 mr-3" size={20} />
              <input 
                type="text" 
                name="location"
                placeholder="Enter location" 
                className="w-full focus:outline-none text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>
            
            <div className="md:w-48 flex items-center px-4 py-3 md:py-2 w-full">
              <Briefcase className="text-gray-400 mr-3" size={20} />
              <select name="experience" className="w-full focus:outline-none text-gray-900 font-medium bg-transparent cursor-pointer">
                <option value="">Select experience</option>
                <option value="Fresher">Fresher</option>
                <option value="1-3">1-3 Yrs</option>
                <option value="3-5">3-5 Yrs</option>
                <option value="5+">5+ Yrs</option>
              </select>
            </div>

            <button type="submit" className="w-full md:w-auto bg-brand hover:bg-brand-hover text-white font-bold py-3 md:py-4 px-8 rounded-full transition-colors mt-2 md:mt-0">
              Search
            </button>
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['Remote', 'MNC', 'Startup', 'Fresher', 'Engineering', 'Analytics', 'Fortune 500'].map((tag) => (
              <Link 
                key={tag} 
                href={`/jobs?type=private&q=${encodeURIComponent(tag)}`}
                className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:border-brand hover:text-brand hover:bg-brand/5 transition-all"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container-custom max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mt-12">
        
        {/* Discover by Role */}
        {popularRoles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">Discover jobs across popular roles</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularRoles.map((role) => (
                <Link key={role.name} href={`/jobs?type=private&category=${encodeURIComponent(role.name)}`} className="bg-white border border-gray-200 rounded-2xl p-5 text-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-brand/40 transition-all group flex flex-col items-center justify-center">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{role.icon}</div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{role.name}</h3>
                  <p className="text-xs font-semibold text-brand bg-brand/5 px-2 py-0.5 rounded-full mt-1">{role.count} Jobs</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Featured Jobs Feed */}
          <div className="flex-[2]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">Recommended for you</h2>
              <Link href="/jobs?type=private" className="text-brand font-bold text-sm hover:underline flex items-center">
                View all <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {displayJobs.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center">
                  <Briefcase size={40} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">No recent private jobs found.</p>
                </div>
              ) : (
                displayJobs.map(job => {
                  const j = job as any;
                  const companyObj = typeof job.company === 'object' ? job.company : null;
                  const isExternal = !!j.applyUrl;
                  const targetUrl = j.applyUrl || `/jobs/private/${job.id}`;

                  return (
                    <div key={job.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-brand/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group relative overflow-hidden">
                      
                      {/* Accent Line */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between">
                        <div className="flex-1">
                          
                          <div className="flex items-center gap-2 mb-2">
                            {isExternal && (
                              <span className="text-[10px] font-bold bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                                Direct Apply <ExternalLink size={10} />
                              </span>
                            )}
                            <span className="text-[10px] font-bold bg-orange-50 border border-orange-200 text-orange-700 px-2 py-0.5 rounded uppercase tracking-wider">
                              {job.jobType || 'Full Time'}
                            </span>
                          </div>

                          <Link href={targetUrl} target={isExternal ? "_blank" : "_self"} className="group-hover:text-brand transition-colors block">
                            <h3 className="text-xl font-bold text-gray-900 pr-12">{job.title}</h3>
                          </Link>
                          
                          <div className="flex items-center gap-2 mt-1.5 mb-3">
                            <span className="font-semibold text-gray-600">{companyObj ? companyObj.name : 'Unknown Company'}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4 font-medium">
                            <div className="flex items-center gap-1.5"><Briefcase size={16} className="text-gray-400" /> {job.experience || "Fresher"}</div>
                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                            <div className="flex items-center gap-1.5"><IndianRupee size={16} className="text-gray-400" /> {job.salary || "Not disclosed"}</div>
                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                            <div className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400" /> {job.location}</div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {j.skills ? j.skills.split(',').slice(0, 3).map((skill: string, i: number) => (
                              <span key={i} className="text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md">{skill.trim()}</span>
                            )) : (
                              ['Software', 'IT'].map(tag => (
                                <span key={tag} className="text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md">{tag}</span>
                              ))
                            )}
                          </div>
                        </div>
                        
                        <div className="shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
                          <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 shrink-0 group-hover:bg-brand/5 group-hover:border-brand/20 transition-colors">
                            {(companyObj as any)?.logo?.url || (companyObj as any)?.logoUrl ? (
                              <img src={(companyObj as any)?.logo?.url || (companyObj as any)?.logoUrl} alt={companyObj?.name} className="w-full h-full object-contain rounded-xl p-1" />
                            ) : (
                              <span className="text-xl font-black group-hover:text-brand transition-colors">{companyObj?.name?.charAt(0) || <Building2 size={24} />}</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 font-bold tracking-wide">
                            {new Date(job.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Top Companies Sidebar */}
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-black text-gray-900">Top companies hiring now</h2>
            
            <div className="bg-white rounded-2xl border border-gray-200 p-1">
              <div className="grid grid-cols-2 gap-1">
                {companies.length > 0 ? companies.map((company: any) => (
                  <Link key={company.id} href={`/companies/${company.id}`} className="flex flex-col items-center justify-center p-6 bg-white hover:bg-gray-50 transition-colors rounded-xl border border-transparent hover:border-gray-100">
                    {(company.logo as any)?.url || company.logoUrl ? (
                      <img src={(company.logo as any)?.url || company.logoUrl} alt={company.name} className="h-10 object-contain mb-3" />
                    ) : (
                      <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-3"><Building2 size={20}/></div>
                    )}
                    <h4 className="font-bold text-gray-900 text-sm text-center line-clamp-1">{company.name}</h4>
                    <div className="text-xs text-brand font-medium mt-1 flex items-center gap-1">
                      View Jobs <ChevronRight size={12} />
                    </div>
                  </Link>
                )) : (
                  <div className="col-span-2 p-8 text-center text-gray-500 font-medium text-sm">No companies found</div>
                )}
              </div>
            </div>

            {/* Sponsored Banner */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10 flex flex-col items-center">
                <span className="bg-white/20 text-[10px] font-black tracking-widest px-2.5 py-1 rounded uppercase mb-4 inline-block">Sponsored</span>
                <h3 className="text-2xl font-black mb-2 leading-tight">Accelerate your career with Premium</h3>
                <p className="text-blue-100 text-sm mb-6 font-medium">Get 3X more recruiter views on your profile.</p>
                <button className="bg-white text-blue-700 font-bold py-3 px-8 rounded-xl text-sm hover:shadow-xl transition-all hover:scale-105 w-full">
                  Upgrade Now
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
