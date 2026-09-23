import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { Building2, MapPin, Briefcase, IndianRupee, Clock, Share2, Bookmark, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { getPayload } from "@/lib/payload";
import { getSavedJobsIds } from "@/app/actions/savedJobs";
import { SaveJobButton } from "@/components/ui/SaveJobButton";
import ApplyButton from "@/components/ui/ApplyButton";
import configPromise from '@payload-config';

// Helper to extract text from Payload Lexical AST
function extractText(node: any): string {
  if (!node) return '';
  let text = '';
  if (node.text) text += node.text;
  if (node.children) {
    for (const child of node.children) {
      text += extractText(child);
    }
  }
  return text;
}

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://rozgarx.com';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const payload = await getPayload();

  try {
    const job = await payload.findByID({ collection: 'jobs', id });
    const j = job as any;
    if (!job || job.type !== 'private') return { title: 'Job Not Found' };
    
    const descText = extractText(job.description).substring(0, 160) + '...';
    const org = (job.company && typeof job.company === 'object') ? job.company.name : 'Unknown Company';
    
    return {
      title: `${job.title} at ${org} - RozgarX`,
      description: descText,
      alternates: {
        canonical: `${SITE_URL}/jobs/private/${job.id}`,
      },
      openGraph: {
        title: `${job.title} - RozgarX`,
        description: descText,
        url: `${SITE_URL}/jobs/private/${job.id}`,
        type: 'website',
        images: [`${SITE_URL}/og-image.jpg`],
      }
    };
  } catch (e) {
    return { title: 'RozgarX' };
  }
}

export default async function PrivateJobDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await getPayload();

  let job;
  try {
    job = await payload.findByID({
      collection: 'jobs',
      id: id,
    });
  } catch (err) {
    notFound();
  }

  if (!job || job.type !== 'private') {
    notFound();
  }
  
  const j = job as any;
  const savedJobIds = await getSavedJobsIds();
  const isSaved = savedJobIds.includes(job.id);

  const isClosed = j.status === 'Closed' || (j.lastDate && new Date(j.lastDate) < new Date());

  // Prepare JSON-LD
  const descText = extractText(job.description);
  const orgName = (job.company && typeof job.company === 'object') ? job.company.name : 'Unknown Company';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    'title': job.title,
    'description': descText,
    'datePosted': job.createdAt,
    'validThrough': isClosed && !j.lastDate ? job.updatedAt : (j.lastDate || undefined),
    'hiringOrganization': {
      '@type': 'Organization',
      'name': orgName,
    },
    'jobLocation': {
      '@type': 'Place',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': j.location || j.state || 'India',
        'addressCountry': 'IN'
      }
    },
    'employmentType': job.jobType === 'Full Time' ? 'FULL_TIME' : job.jobType === 'Part Time' ? 'PART_TIME' : job.jobType === 'Contract' ? 'CONTRACTOR' : undefined,
    'baseSalary': (job.salary && !isNaN(Number(job.salary))) ? {
      '@type': 'MonetaryAmount',
      'currency': 'INR',
      'value': { '@type': 'QuantitativeValue', 'value': Number(job.salary) }
    } : undefined,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
      { '@type': 'ListItem', 'position': 2, 'name': 'Private Jobs', 'item': `${SITE_URL}/jobs/private` },
      ...(j.privateCategory ? [{ '@type': 'ListItem', 'position': 3, 'name': j.privateCategory, 'item': `${SITE_URL}/private/${j.privateCategory.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}` }] : []),
      { '@type': 'ListItem', 'position': j.privateCategory ? 4 : 3, 'name': job.title }
    ]
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="container-custom max-w-6xl">
        
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex gap-2">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span>/</span>
          <Link href="/jobs/private" className="hover:text-brand">Private Jobs</Link>
          <span>/</span>
          {j.privateCategory && (
            <>
              <Link href={`/private/${j.privateCategory.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="hover:text-brand">{j.privateCategory}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-black font-medium">{job.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-lg p-6 md:p-8 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {isClosed ? (
                      <span className="px-3 py-1 bg-gray-600 text-white text-xs font-bold uppercase tracking-wider rounded">
                        Closed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded">
                        {j.workMode || 'Private'}
                      </span>
                    )}
                    {j.isVerified && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold tracking-wider rounded flex items-center gap-1">
                        <ShieldCheck size={12} /> Official Verified
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">{job.title}</h1>
                  <div className="flex items-center gap-2 text-lg font-medium text-gray-700">
                    <Building2 size={20} className="text-gray-400" />
                    {job.company && typeof job.company === 'object' ? (
                      <Link href={`/companies/${(job.company as any).slug || (job.company as any).id}`} className="hover:text-brand hover:underline transition-colors">
                        {(job.company as any).name}
                      </Link>
                    ) : (
                      'Unknown Company'
                    )}
                  </div>
                </div>
                <div className="p-2 bg-gray-50 rounded-full flex items-center justify-center transition-colors">
                  <SaveJobButton jobId={job.id} initialIsSaved={isSaved} iconSize={20} className="text-gray-400" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded">
                  <MapPin size={16} className="text-gray-400" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded">
                  <IndianRupee size={16} className="text-gray-400" />
                  <span className="font-semibold text-black">{job.salary || 'Not Disclosed'}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded">
                  <Briefcase size={16} className="text-gray-400" />
                  {job.experience || 'Entry Level'}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-brand/10 text-brand font-medium text-xs rounded-full">
                  {job.jobType || 'Full Time'}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 font-medium text-xs rounded-full">
                  {job.workMode || 'Hybrid'}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 font-medium text-xs rounded-full">
                  IT / Software
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-gray-500 border-t border-gray-100 pt-4">
                <span className="flex items-center gap-1.5"><Clock size={14} /> Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                {job.updatedAt && <span className="flex items-center gap-1.5"><Clock size={14} /> Updated: {new Date(job.updatedAt).toLocaleDateString()}</span>}
                {j.isVerified && j.verifiedDate && <span className="flex items-center gap-1.5 text-green-600"><ShieldCheck size={14} /> Verified: {new Date(j.verifiedDate).toLocaleDateString()}</span>}
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-lg p-6 md:p-8 border border-gray-200">
              <h2 className="text-xl font-bold text-black mb-4">Job Description</h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                <p>
                  We are looking for a highly skilled {job.title} to join our growing team at {job.company && typeof job.company === 'object' ? job.company.name : 'our company'}. 
                  In this role, you will be responsible for developing high-quality solutions, working closely with 
                  cross-functional teams, and driving product innovation.
                </p>
                
                <h3 className="text-black font-bold text-lg mt-6 mb-3">Key Responsibilities</h3>
                <ul className="list-none space-y-2">
                  {['Design, develop, and maintain robust systems.', 'Collaborate with product and design teams.', 'Write clean, testable, and efficient code.', 'Participate in code reviews and architecture discussions.'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="text-brand flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-black font-bold text-lg mt-6 mb-3">Requirements</h3>
                <ul className="list-none space-y-2">
                  {[`${job.experience || 'Prior'} of relevant experience.`, 'Strong problem-solving and communication skills.', 'Bachelor\'s degree in Computer Science or related field.', 'Ability to work independently in a fast-paced environment.'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="text-brand flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Action Card */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-24">
              <ApplyButton jobId={String(job.id)} applyUrl={j.applyUrl} className="mb-3" />
              <button className="w-full bg-white border border-black text-black font-bold py-3 px-4 rounded-md hover:bg-black hover:text-white transition-colors mb-6 flex items-center justify-center gap-2">
                <Share2 size={18} /> Share Job
              </button>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-bold text-black mb-4">Job Overview</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Posted Date</p>
                    <p className="font-medium text-black flex items-center gap-1.5"><Clock size={16} className="text-gray-400"/> {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US') : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Industry</p>
                    <p className="font-medium text-black">IT / Software</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Job Type</p>
                    <p className="font-medium text-black">{job.jobType || 'Full Time'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Card */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-black mb-4">About Company</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  <Building2 size={24} className="text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-black">{job.company && typeof job.company === 'object' ? job.company.name : 'Unknown Company'}</p>
                  <Link href="#" className="text-brand text-sm font-medium hover:underline">View Profile</Link>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                {job.company && typeof job.company === 'object' ? job.company.name : 'This company'} is a leading organization, committed to delivering excellence and innovation.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
    </>
  );
}
