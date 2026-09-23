import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Building2, MapPin, Users, Globe, ExternalLink, ShieldCheck, ChevronRight, Briefcase } from "lucide-react";
import { getPayload } from "@/lib/payload";
import RichTextParser from "@/components/RichTextParser";
import PrivateJobRow from "@/components/ui/PrivateJobRow";

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://rozgarx.com';

// Helper to extract plain text for SEO
function extractText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (node.text) return node.text;
  if (node.children) return node.children.map(extractText).join(' ');
  return '';
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload();

  try {
    const res = await payload.find({
      collection: 'companies' as any,
      where: {
        and: [
          { slug: { equals: slug } },
          { isPublished: { equals: true } }
        ]
      },
      limit: 1,
    });
    
    const company = res.docs[0] as any;
    if (!company) return { title: 'Company Not Found' };
    
    // Check if thin profile
    const activeJobsRes = await payload.find({
      collection: 'jobs',
      where: {
        and: [
          { company: { equals: company.id } },
          { type: { equals: 'private' } },
          { status: { in: ['Open', 'Closing Soon'] } }
        ]
      },
      limit: 1,
    });
    
    const hasDescription = company.description && extractText(company.description).trim().length > 10;
    const hasActiveJobs = activeJobsRes.totalDocs > 0;
    
    const isThin = !hasDescription && !hasActiveJobs;
    
    let descText = hasDescription ? extractText(company.description).substring(0, 160) + '...' : `Explore jobs at ${company.name} in the ${company.industry} industry on RozgarX.`;
    
    return {
      title: `${company.name} Careers & Jobs - RozgarX`,
      description: descText,
      robots: isThin ? "noindex, follow" : "index, follow",
      alternates: {
        canonical: `${SITE_URL}/companies/${company.slug}`,
      },
      openGraph: {
        title: `${company.name} Careers & Jobs - RozgarX`,
        description: descText,
        url: `${SITE_URL}/companies/${company.slug}`,
        type: 'profile',
        images: company.logo?.url ? [company.logo.url] : [],
      }
    };
  } catch (e) {
    return { title: 'RozgarX' };
  }
}

export default async function CompanyProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getPayload();

  const res = await payload.find({
    collection: 'companies' as any,
    where: {
      and: [
        { slug: { equals: slug } },
        { isPublished: { equals: true } }
      ]
    },
    limit: 1,
  });

  const company = res.docs[0] as any;
  if (!company) {
    notFound();
  }

  // Fetch active private jobs
  const activeJobsRes = await payload.find({
    collection: 'jobs',
    where: {
      and: [
        { company: { equals: company.id } },
        { type: { equals: 'private' } },
        { status: { in: ['Open', 'Closing Soon'] } }
      ]
    },
    sort: '-createdAt',
    limit: 50,
  });
  const activeJobs = activeJobsRes.docs;

  // Fetch closed private jobs
  const closedJobsRes = await payload.find({
    collection: 'jobs',
    where: {
      and: [
        { company: { equals: company.id } },
        { type: { equals: 'private' } },
        { status: { equals: 'Closed' } }
      ]
    },
    sort: '-createdAt',
    limit: 10,
  });
  const closedJobs = closedJobsRes.docs;

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="container-custom max-w-5xl mx-auto flex items-center text-sm text-gray-500 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <Link href="/" className="hover:text-brand transition-colors">Home</Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <Link href="/private" className="hover:text-brand transition-colors">Private Jobs</Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <Link href="/companies" className="hover:text-brand transition-colors">Companies</Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <span className="text-gray-900 font-medium">{company.name}</span>
        </div>
      </div>

      {/* Company Header */}
      <section className="bg-white border-b border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
              {company.logo && typeof company.logo === 'object' && company.logo.url ? (
                <img src={company.logo.url} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-gray-400">
                  {company.name.charAt(0)}
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 flex items-center gap-2 flex-wrap">
                {company.name}
                {company.isVerified && (
                  <span title="Verified Business Entity (Does not imply endorsement or hiring guarantee by RozgarX)" className="text-green-600 bg-green-50 p-1 rounded-full inline-flex">
                    <ShieldCheck size={24} />
                  </span>
                )}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <Building2 size={18} className="text-gray-400" />
                  {company.industry}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={18} className="text-gray-400" />
                  {company.location}
                </div>
                {company.companySize && (
                  <div className="flex items-center gap-1.5">
                    <Users size={18} className="text-gray-400" />
                    {company.companySize} Employees
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
              {company.careerUrl && (
                <a 
                  href={company.careerUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-brand hover:bg-brand-hover text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Briefcase size={18} />
                  Official Careers Page
                </a>
              )}
              {company.websiteUrl && (
                <a 
                  href={company.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Globe size={18} />
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content */}
          <div className="flex-[2] space-y-10">
            {/* About Company */}
            {company.description && (
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-brand rounded-full"></div>
                  About {company.name}
                </h2>
                <div className="prose prose-gray max-w-none text-gray-600">
                  <RichTextParser content={company.description} />
                </div>
              </section>
            )}

            {/* Active Jobs */}
            <section>
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center justify-between">
                Active Jobs ({activeJobs.length})
              </h2>
              
              {activeJobs.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                  <Briefcase className="mx-auto text-gray-300 mb-3" size={32} />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No active positions</h3>
                  <p className="text-gray-500">There are currently no open jobs at {company.name}. Check back later.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeJobs.map((job) => (
                    <PrivateJobRow key={job.id} job={job} />
                  ))}
                </div>
              )}
            </section>

            {/* Closed Jobs */}
            {closedJobs.length > 0 && (
              <section className="pt-6">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Past Opportunities</h3>
                <div className="space-y-3 opacity-60 grayscale-[30%]">
                  {closedJobs.map((job) => (
                    <PrivateJobRow key={job.id} job={job} />
                  ))}
                </div>
              </section>
            )}
            
          </div>
          
          {/* Sidebar */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Company Overview</h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <div className="text-gray-500 mb-1">Industry</div>
                  <div className="font-medium text-gray-900">{company.industry}</div>
                </li>
                <li>
                  <div className="text-gray-500 mb-1">Headquarters</div>
                  <div className="font-medium text-gray-900">{company.location}</div>
                </li>
                {company.companySize && (
                  <li>
                    <div className="text-gray-500 mb-1">Company Size</div>
                    <div className="font-medium text-gray-900">{company.companySize} employees</div>
                  </li>
                )}
                {company.websiteUrl && (
                  <li>
                    <div className="text-gray-500 mb-1">Website</div>
                    <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline break-all flex items-center gap-1">
                      {company.websiteUrl.replace(/^https?:\/\//, '')}
                      <ExternalLink size={12} />
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
