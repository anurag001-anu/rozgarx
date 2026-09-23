import { Search, MapPin, Building2, Briefcase, ChevronRight, FileText, Target, TrendingUp, Compass, ArrowRight, UserPlus, UploadCloud, Sparkles, ShieldCheck, Zap, Mail, Monitor, Wallet, Landmark, Stethoscope, LineChart, PenTool, Headphones, Database } from "lucide-react";
import Link from "next/link";
import JobSwitcher from "@/components/home/JobSwitcher";
import CompanyRow from "@/components/ui/CompanyRow";
import { getPayload } from "@/lib/payload";
import { cookies } from "next/headers";

export default async function Home() {
  const payload = await getPayload();

  const cookieStore = await cookies();
  const token = cookieStore.get("payload-token")?.value;
  let user = null;
  if (token) {
    const authRes = await payload.auth({
      headers: new Headers({
        Authorization: `JWT ${token}`
      })
    });
    user = authRes.user;
  }

  // Fetch latest Government Jobs
  const govtJobsRes = await payload.find({
    collection: 'jobs',
    where: {
      type: { equals: 'government' },
    },
    limit: 20, // Fetch more to filter out expired ones
    sort: '-createdAt',
  });

  // Fetch latest Private Jobs
  const privateJobsRes = await payload.find({
    collection: 'jobs',
    where: {
      type: { equals: 'private' },
    },
    limit: 20,
    sort: '-createdAt',
  });

  const companiesRes = await payload.find({
    collection: 'companies',
    limit: 4,
    sort: '-createdAt',
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filterActiveJobs = (jobs: any[]) => {
    return jobs.filter(job => {
      if (job.status === 'Closed') return false;
      if (job.lastDate) {
        const lastDate = new Date(job.lastDate);
        if (lastDate < today) return false;
      }
      return true;
    }).slice(0, 5);
  };

  const govtJobs = filterActiveJobs(govtJobsRes.docs);
  const privateJobs = filterActiveJobs(privateJobsRes.docs);
  const topCompanies = companiesRes.docs;
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Job Discovery Workspace (Hero) */}
      <section className="relative overflow-hidden pt-6 pb-20 lg:pt-8 lg:pb-32 px-4 sm:px-6 lg:px-8 bg-transparent z-0">
        
        {/* Subtle Grid Pattern limited to Hero Section */}
        <div className="absolute inset-0 z-[-1] pointer-events-none bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"></div>

        <div className="container-custom max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Content */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start pt-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FFF0E5] text-brand px-5 py-2.5 rounded-full text-sm font-bold mb-8 shadow-sm border border-brand/20">
              <Sparkles size={16} fill="currentColor" />
              One Platform. Every Opportunity.
            </div>
            
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-[#0A1629] mb-4 md:mb-6 leading-[1.15] md:leading-[1.1]">
              Find Your Next <br className="hidden sm:block" />
              <span className="text-brand">Opportunity</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl mb-8 md:mb-12 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Discover thousands of government and private sector jobs across India. 
              Fast, practical, and up-to-date.
            </p>

            {/* Mobile Image (Appears between text and search bar) */}
            <div className="flex lg:hidden justify-center items-center w-full mb-8">
               <div className="relative w-full max-w-[280px] sm:max-w-[320px] flex items-center justify-center">
                  <img 
                    src="/images/latest_vector_girl.png" 
                    alt="Job Search Illustration" 
                    className="w-full h-auto object-contain drop-shadow-lg"
                  />
               </div>
            </div>

            {/* Search Bar (Bigger version) */}
            <form action="/jobs" method="GET" className="w-full lg:w-[950px] max-w-none bg-white p-1.5 md:p-3 rounded-full md:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-row items-center gap-0.5 md:gap-3 mb-10 md:mb-12 relative z-20">
              <div className="flex-1 flex items-center px-2 md:px-6 py-1.5 md:py-3 min-w-0">
                <Search className="text-gray-400 mr-1 md:mr-3 flex-shrink-0" size={18} />
                <input 
                  type="text" 
                  name="q"
                  placeholder="Job title..." 
                  className="w-full py-1 text-black focus:outline-none placeholder:text-gray-400 min-w-0 bg-transparent text-xs sm:text-sm md:text-base font-medium truncate"
                />
              </div>
              
              <div className="w-px h-6 md:h-10 bg-gray-200 flex-shrink-0"></div>
              
              <div className="flex-1 flex items-center px-2 md:px-6 py-1.5 md:py-3 min-w-0">
                <MapPin className="text-gray-400 mr-1 md:mr-3 flex-shrink-0" size={18} />
                <input 
                  type="text" 
                  name="location"
                  placeholder="Location..." 
                  className="w-full py-1 text-black focus:outline-none placeholder:text-gray-400 min-w-0 bg-transparent text-xs sm:text-sm md:text-base font-medium truncate"
                />
              </div>
              <button type="submit" className="bg-brand hover:bg-brand-hover text-white font-bold py-2 md:py-5 px-4 md:px-12 rounded-full md:rounded-xl transition-colors shadow-md shadow-brand/20 flex-shrink-0 text-xs md:text-base tracking-wide flex items-center justify-center">
                <span className="hidden md:inline">Search Jobs</span>
                <span className="md:hidden">Search</span>
              </button>
            </form>

            {/* Popular Tags */}
            <div className="flex flex-col items-center justify-center gap-3 md:gap-4 text-sm md:text-base text-gray-700 font-medium w-full lg:w-[950px] relative z-20 pb-4 overflow-hidden">
              <span className="font-bold text-gray-500 text-xs tracking-wider uppercase md:normal-case md:tracking-normal md:text-black md:text-base lg:text-lg whitespace-nowrap z-10 text-center">Popular:</span>
              
              {/* Marquee Wrapper */}
              <div className="flex flex-row items-center w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                <div className="flex flex-row flex-nowrap items-center gap-2 md:gap-3 w-max animate-marquee hover:[animation-play-state:paused] pb-1">
                  
                  {/* Original Tags */}
                  <Link href="/search?q=Software" className="flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-brand transition-colors bg-white px-3 md:px-4 py-2 md:py-2.5 rounded-full shadow-sm border border-gray-100 whitespace-nowrap text-xs md:text-sm">
                    <span className="font-mono font-bold text-gray-400">&lt;/&gt;</span> Software Engineer
                  </Link>
                  <Link href="/search?q=Civil" className="flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-brand transition-colors bg-white px-3 md:px-4 py-2 md:py-2.5 rounded-full shadow-sm border border-gray-100 whitespace-nowrap text-xs md:text-sm">
                    <Building2 size={16} className="text-gray-400" /> Civil Engineer
                  </Link>
                  <Link href="/search?q=Govt" className="flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-brand transition-colors bg-white px-3 md:px-4 py-2 md:py-2.5 rounded-full shadow-sm border border-gray-100 whitespace-nowrap text-xs md:text-sm">
                    <Building2 size={16} className="text-gray-400" /> Government Jobs
                  </Link>
                  <Link href="/search?q=Banking" className="flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-brand transition-colors bg-white px-3 md:px-4 py-2 md:py-2.5 rounded-full shadow-sm border border-gray-100 whitespace-nowrap text-xs md:text-sm">
                    <Building2 size={16} className="text-gray-400" /> Banking
                  </Link>
                  <Link href="/search?q=WFH" className="flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-brand transition-colors bg-white px-3 md:px-4 py-2 md:py-2.5 rounded-full shadow-sm border border-gray-100 whitespace-nowrap text-xs md:text-sm">
                    <MapPin size={16} className="text-gray-400" /> Work From Home
                  </Link>
                  
                  {/* Duplicated Tags for seamless marquee */}
                  <Link href="/search?q=Software" className="flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-brand transition-colors bg-white px-3 md:px-4 py-2 md:py-2.5 rounded-full shadow-sm border border-gray-100 whitespace-nowrap text-xs md:text-sm">
                    <span className="font-mono font-bold text-gray-400">&lt;/&gt;</span> Software Engineer
                  </Link>
                  <Link href="/search?q=Civil" className="flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-brand transition-colors bg-white px-3 md:px-4 py-2 md:py-2.5 rounded-full shadow-sm border border-gray-100 whitespace-nowrap text-xs md:text-sm">
                    <Building2 size={16} className="text-gray-400" /> Civil Engineer
                  </Link>
                  <Link href="/search?q=Govt" className="flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-brand transition-colors bg-white px-3 md:px-4 py-2 md:py-2.5 rounded-full shadow-sm border border-gray-100 whitespace-nowrap text-xs md:text-sm">
                    <Building2 size={16} className="text-gray-400" /> Government Jobs
                  </Link>
                  <Link href="/search?q=Banking" className="flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-brand transition-colors bg-white px-3 md:px-4 py-2 md:py-2.5 rounded-full shadow-sm border border-gray-100 whitespace-nowrap text-xs md:text-sm">
                    <Building2 size={16} className="text-gray-400" /> Banking
                  </Link>
                  <Link href="/search?q=WFH" className="flex items-center gap-1.5 md:gap-2 text-gray-700 hover:text-brand transition-colors bg-white px-3 md:px-4 py-2 md:py-2.5 rounded-full shadow-sm border border-gray-100 whitespace-nowrap text-xs md:text-sm">
                    <MapPin size={16} className="text-gray-400" /> Work From Home
                  </Link>
                  
                </div>
              </div>
            </div>
          </div>

          {/* Right Content (Custom Vector Illustration) - Desktop Only */}
          <div className="hidden lg:flex justify-center items-center w-full relative pl-6 -mt-48">
             <div className="relative w-full max-w-[550px] flex items-center justify-center">
                <img 
                  src="/images/latest_vector_girl.png" 
                  alt="Job Search Illustration" 
                  className="w-full h-auto object-contain drop-shadow-lg scale-110"
                />
             </div>
          </div>
        </div>
      </section>

      {/* 2. Job Feed Switcher (Gov vs Private) */}
      <section className="bg-transparent py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100/50">
        <div className="container-custom">
          <JobSwitcher initialGovtJobs={govtJobs} initialPrivateJobs={privateJobs} />
        </div>
      </section>

      {/* 3. Top Companies Area */}
      <section className="bg-transparent py-16 px-4 sm:px-6 lg:px-8">
        <div className="container-custom max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-black flex items-center gap-2">
              <Building2 className="text-brand" size={24} /> Top Companies Hiring
            </h2>
            <Link href="/companies" className="text-black font-medium hover:text-brand flex items-center gap-1 transition-colors">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topCompanies.map(company => (
              <CompanyRow key={company.id} company={company} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Career Tools */}
      <section className="bg-transparent py-16 px-4 sm:px-6 lg:px-8">
        <div className="container-custom max-w-5xl">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Career Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Link href="/tools/resume" className="group relative bg-white p-8 border border-gray-200 rounded-2xl hover:border-brand/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="w-14 h-14 bg-brand/5 text-brand rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand group-hover:text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-brand/25">
                <FileText size={26} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-2 group-hover:text-brand transition-colors">Resume Builder</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">Create a professional resume in minutes.</p>
            </Link>

            <Link href="/tools/interview" className="group relative bg-white p-8 border border-gray-200 rounded-2xl hover:border-brand/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="w-14 h-14 bg-brand/5 text-brand rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand group-hover:text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-brand/25">
                <Target size={26} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-2 group-hover:text-brand transition-colors">Interview Prep</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">Prepare for real world interviews.</p>
            </Link>

            <Link href="/tools/salary" className="group relative bg-white p-8 border border-gray-200 rounded-2xl hover:border-brand/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="w-14 h-14 bg-brand/5 text-brand rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand group-hover:text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-brand/25">
                <TrendingUp size={26} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-2 group-hover:text-brand transition-colors">Salary Guide</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">Understand market salary trends.</p>
            </Link>

            <Link href="/tools/roadmap" className="group relative bg-white p-8 border border-gray-200 rounded-2xl hover:border-brand/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="w-14 h-14 bg-brand/5 text-brand rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand group-hover:text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-brand/25">
                <Compass size={26} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-2 group-hover:text-brand transition-colors">Career Roadmap</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">Find the right career direction.</p>
            </Link>

          </div>
        </div>
      </section>

      {/* 5. Explore Top Categories */}
      <section className="bg-transparent py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100/50">
        <div className="container-custom max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-black mb-2">Explore by Category</h2>
              <p className="text-gray-600">Find opportunities in your preferred industry and domain.</p>
            </div>
            <Link href="/categories" className="hidden md:flex text-black font-medium hover:text-brand items-center gap-1 transition-colors">
              All Categories <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: 'IT & Software', count: '1,240', icon: Monitor },
              { name: 'Banking & Finance', count: '860', icon: Wallet },
              { name: 'Govt & Public', count: '920', icon: Landmark },
              { name: 'Healthcare', count: '410', icon: Stethoscope },
              { name: 'Sales & Marketing', count: '750', icon: LineChart },
              { name: 'Design & Creative', count: '380', icon: PenTool },
              { name: 'Customer Support', count: '640', icon: Headphones },
              { name: 'Data & Analytics', count: '530', icon: Database }
            ].map(category => (
              <Link key={category.name} href={`/search?q=${category.name}`} className="group relative bg-white p-6 border border-gray-200 rounded-2xl hover:border-brand/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col items-start overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight size={18} className="text-brand -rotate-45" />
                </div>
                <div className="w-12 h-12 bg-gray-50 text-gray-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand/10 group-hover:text-brand transition-colors duration-300">
                  <category.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-black text-lg group-hover:text-brand transition-colors">{category.name}</h3>
                <p className="text-sm text-gray-500 font-medium mt-1">{category.count} Open Jobs</p>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/categories" className="inline-flex text-black font-bold hover:text-brand items-center gap-1 transition-colors">
              View All Categories <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>


      {/* 9. Product Benefits */}
      <section className="bg-transparent py-12 px-4 sm:px-6 lg:px-8 border-y border-gray-200/50">
        <div className="container-custom max-w-5xl">
          <h2 className="text-center font-bold text-gray-400 uppercase tracking-widest text-sm mb-8">Everything You Need to Find Your Next Job</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <ShieldCheck size={24} className="text-brand mb-3" />
              <h3 className="font-bold text-black text-sm mb-1">Verified Job Information</h3>
            </div>
            <div className="flex flex-col items-center">
              <Search size={24} className="text-brand mb-3" />
              <h3 className="font-bold text-black text-sm mb-1">Easy Job Discovery</h3>
            </div>
            <div className="flex flex-col items-center">
              <Building2 size={24} className="text-brand mb-3" />
              <h3 className="font-bold text-black text-sm mb-1">Government + Private Opportunities</h3>
            </div>
            <div className="flex flex-col items-center">
              <Zap size={24} className="text-brand mb-3" />
              <h3 className="font-bold text-black text-sm mb-1">Simple Application Experience</h3>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Final CTA */}
      <section className="bg-brand/5 py-16 px-4 sm:px-6 lg:px-8 text-center backdrop-blur-sm border-t border-white/50">
        <div className="container-custom max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-4">Ready for Your Next Opportunity?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Explore Government and Private jobs and take the next step in your career.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/jobs" className="w-full sm:w-auto bg-brand text-white font-bold py-3 px-8 rounded hover:bg-brand-hover transition-colors">
              Explore Jobs
            </Link>
            {!user ? (
              <Link href="/profile/create" className="w-full sm:w-auto bg-transparent border-2 border-brand text-brand font-bold py-3 px-8 rounded hover:bg-brand/10 transition-colors">
                Create Profile
              </Link>
            ) : user.role === 'employer' ? (
              <Link href="/employer" className="w-full sm:w-auto bg-transparent border-2 border-brand text-brand font-bold py-3 px-8 rounded hover:bg-brand/10 transition-colors">
                Employer Dashboard
              </Link>
            ) : (
              <Link href="/profile" className="w-full sm:w-auto bg-transparent border-2 border-brand text-brand font-bold py-3 px-8 rounded hover:bg-brand/10 transition-colors">
                My Profile
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
