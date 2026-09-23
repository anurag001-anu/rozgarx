import React from 'react';
import Link from 'next/link';
import { 
  Building2, Landmark, Briefcase, ChevronRight, 
  ShieldCheck, GraduationCap, MonitorPlay, HeartPulse,
  BadgeCent, LayoutGrid
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Job Categories - RozgarX",
  description: "Browse all Government and Private job categories on RozgarX to find your next opportunity.",
};

const governmentCategories = [
  { name: 'SSC', icon: Landmark, count: '100+', color: 'bg-blue-500' },
  { name: 'UPSC', icon: Landmark, count: '50+', color: 'bg-indigo-500' },
  { name: 'Railway', icon: Building2, count: '200+', color: 'bg-red-500' },
  { name: 'Banking', icon: BadgeCent, count: '150+', color: 'bg-emerald-500' },
  { name: 'Defence', icon: ShieldCheck, count: '80+', color: 'bg-green-600' },
  { name: 'Police', icon: ShieldCheck, count: '120+', color: 'bg-blue-600' },
  { name: 'Teaching', icon: GraduationCap, count: '300+', color: 'bg-yellow-500' },
  { name: 'State Government', icon: Landmark, count: '500+', color: 'bg-purple-500' },
];

const privateCategories = [
  { name: 'IT & Software', icon: MonitorPlay, count: '1000+', color: 'bg-brand' },
  { name: 'Engineering', icon: Building2, count: '800+', color: 'bg-orange-500' },
  { name: 'Finance', icon: BadgeCent, count: '400+', color: 'bg-emerald-500' },
  { name: 'Sales', icon: Briefcase, count: '1500+', color: 'bg-blue-500' },
  { name: 'Marketing', icon: LayoutGrid, count: '600+', color: 'bg-pink-500' },
  { name: 'Healthcare', icon: HeartPulse, count: '700+', color: 'bg-rose-500' },
  { name: 'BPO', icon: Briefcase, count: '2000+', color: 'bg-cyan-500' },
  { name: 'Internship', icon: GraduationCap, count: '500+', color: 'bg-violet-500' },
];

export default function CategoriesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden border-b border-gray-100 bg-brand/5">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-white blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="container-custom max-w-6xl mx-auto text-center relative z-10 px-4">
          <div className="inline-flex items-center gap-2 bg-white border border-brand/20 text-brand px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-sm">
            <LayoutGrid size={16} />
            Explore by Category
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black tracking-tight mb-6 leading-tight">
            Find the Perfect <span className="text-brand">Opportunity</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
            Browse through hundreds of job listings across various government departments and private sectors. Choose a category below to get started.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24 px-4 bg-gray-50/50">
        <div className="container-custom max-w-6xl mx-auto">
          
          {/* Government Categories */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Landmark size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-black">Government Jobs</h2>
                <p className="text-gray-500 font-medium mt-1">Explore official government & PSU opportunities</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {governmentCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link 
                    href={`/jobs?type=government&category=${encodeURIComponent(category.name)}`} 
                    key={category.name}
                    className="group bg-white border border-gray-200 hover:border-blue-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ChevronRight className="text-blue-500" size={20} />
                    </div>
                    <div className={`w-14 h-14 rounded-2xl ${category.color} text-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                      {category.count} Active Jobs
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Private Categories */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                <Building2 size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-black">Private Jobs</h2>
                <p className="text-gray-500 font-medium mt-1">Top roles in corporate and startups</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {privateCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link 
                    href={`/jobs?type=private&category=${encodeURIComponent(category.name)}`} 
                    key={category.name}
                    className="group bg-white border border-gray-200 hover:border-brand/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-brand/5 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ChevronRight className="text-brand" size={20} />
                    </div>
                    <div className={`w-14 h-14 rounded-2xl ${category.color} text-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                      {category.count} Active Jobs
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
