import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { Building2, MapPin, Briefcase, GraduationCap, Calendar, Users, FileText, Download, Share2, ShieldCheck, Clock, ArrowRight, BellRing } from "lucide-react";
import Link from "next/link";
import { getPayload } from "@/lib/payload";
import { getSavedJobsIds } from "@/app/actions/savedJobs";
import { SaveJobButton } from "@/components/ui/SaveJobButton";
import ApplyButton from "@/components/ui/ApplyButton";
import configPromise from '@payload-config';
import RichTextParser from "@/components/RichTextParser";

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
    if (!job || job.type !== 'government') return { title: 'Job Not Found' };
    
    const descText = extractText(job.description).substring(0, 160) + '...';
    const org = j.organization || 'Government Organization';
    
    return {
      title: `${job.title} at ${org} - RozgarX`,
      description: descText,
      alternates: {
        canonical: `${SITE_URL}/jobs/government/${job.id}`,
      },
      openGraph: {
        title: `${job.title} - RozgarX`,
        description: descText,
        url: `${SITE_URL}/jobs/government/${job.id}`,
        type: 'website',
        images: [`${SITE_URL}/og-image.jpg`],
      }
    };
  } catch (e) {
    return { title: 'RozgarX' };
  }
}

export default async function GovJobDetails({ params }: { params: Promise<{ id: string }> }) {
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

  if (!job || job.type !== 'government') {
    notFound();
  }
  
  const j = job as any;
  const savedJobIds = await getSavedJobsIds();
  const isSaved = savedJobIds.includes(job.id);

  const isClosed = j.status === 'Closed' || (j.lastDate && new Date(j.lastDate) < new Date());

  // Fetch Related Updates
  const [resultsRes, admitCardsRes, answerKeysRes, syllabusesRes, notificationsRes] = await Promise.all([
    payload.find({ collection: 'results' as any, where: { and: [{ relatedJob: { equals: id } }, { isPublished: { equals: true } }] }, limit: 5 }),
    payload.find({ collection: 'admit-cards' as any, where: { and: [{ relatedJob: { equals: id } }, { isPublished: { equals: true } }] }, limit: 5 }),
    payload.find({ collection: 'answer-keys' as any, where: { and: [{ relatedJob: { equals: id } }, { isPublished: { equals: true } }] }, limit: 5 }),
    payload.find({ collection: 'syllabuses' as any, where: { and: [{ relatedJob: { equals: id } }, { isPublished: { equals: true } }] }, limit: 5 }),
    payload.find({ collection: 'govt-notifications' as any, where: { and: [{ relatedJob: { equals: id } }, { isPublished: { equals: true } }] }, limit: 5 }),
  ]);

  const relatedUpdates = [
    ...resultsRes.docs.map((doc: any) => ({ type: 'Result', title: doc.title, url: `/government/results/${doc.slug}`, date: doc.updatedAt })),
    ...admitCardsRes.docs.map((doc: any) => ({ type: 'Admit Card', title: doc.title, url: `/government/admit-cards/${doc.slug}`, date: doc.updatedAt })),
    ...answerKeysRes.docs.map((doc: any) => ({ type: 'Answer Key', title: doc.title, url: `/government/answer-keys/${doc.slug}`, date: doc.updatedAt })),
    ...syllabusesRes.docs.map((doc: any) => ({ type: 'Syllabus', title: doc.title, url: `/government/syllabuses/${doc.slug}`, date: doc.updatedAt })),
    ...notificationsRes.docs.map((doc: any) => ({ type: 'Notification', title: doc.title, url: `/government/notifications/${doc.slug}`, date: doc.updatedAt })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Prepare JSON-LD
  const descText = extractText(job.description);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    'title': job.title,
    'description': descText,
    'datePosted': job.createdAt,
    'validThrough': isClosed && !j.lastDate ? job.updatedAt : (j.lastDate || undefined),
    'hiringOrganization': {
      '@type': 'Organization',
      'name': j.organization || 'Government Organization',
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
      { '@type': 'ListItem', 'position': 2, 'name': 'Government Jobs', 'item': `${SITE_URL}/jobs/government` },
      ...(j.govtCategory ? [{ '@type': 'ListItem', 'position': 3, 'name': j.govtCategory, 'item': `${SITE_URL}/government/${j.govtCategory.toLowerCase()}` }] : []),
      { '@type': 'ListItem', 'position': j.govtCategory ? 4 : 3, 'name': job.title }
    ]
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="container-custom max-w-5xl">
        
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex gap-2">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span>/</span>
          <Link href="/jobs/government" className="hover:text-brand">Government Jobs</Link>
          <span>/</span>
          {j.govtCategory && (
            <>
              <Link href={`/government/${j.govtCategory.toLowerCase()}`} className="hover:text-brand">{j.govtCategory}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-black font-medium">{job.title}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-t-lg p-6 md:p-8 border-x border-t border-gray-200 border-b-4 border-b-brand mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {isClosed ? (
                  <span className="px-3 py-1 bg-gray-600 text-white text-xs font-bold uppercase tracking-wider rounded">
                    Closed
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider rounded">
                    Govt Job
                  </span>
                )}
                {j.isVerified && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold tracking-wider rounded flex items-center gap-1">
                    <ShieldCheck size={14} /> Official Verified
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-black mb-2">{job.title}</h1>
              <p className="text-lg font-medium text-gray-700 flex items-center gap-2">
                <Building2 size={20} className="text-gray-400" />
                {j.organization || 'Government Organization'}
              </p>
            </div>
            <div className="flex gap-2">
              <div className="bg-gray-100 hover:bg-gray-200 p-2 rounded flex items-center justify-center transition-colors">
                <SaveJobButton jobId={job.id} initialIsSaved={isSaved} iconSize={20} className="text-gray-700" />
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded transition-colors" title="Download Notification">
                <Download size={20} />
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded transition-colors" title="Share">
                <Share2 size={20} />
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-gray-500 border-t border-gray-100 pt-4">
            <span className="flex items-center gap-1.5"><Clock size={14} /> Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
            {job.updatedAt && <span className="flex items-center gap-1.5"><Clock size={14} /> Updated: {new Date(job.updatedAt).toLocaleDateString()}</span>}
            {j.isVerified && j.verifiedDate && <span className="flex items-center gap-1.5 text-green-600"><ShieldCheck size={14} /> Verified: {new Date(j.verifiedDate).toLocaleDateString()}</span>}
          </div>
        </div>

        {/* Details Table Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="font-bold text-black flex items-center gap-2">
              <FileText size={20} className="text-brand" /> 
              Important Information
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <th className="py-4 px-6 font-semibold text-gray-700 bg-gray-50/50 w-1/3">Organization</th>
                  <td className="py-4 px-6 text-black font-medium">{job.organization || 'Government Organization'}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <th className="py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Post Name</th>
                  <td className="py-4 px-6 text-black font-medium">{job.title}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <th className="py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Total Vacancies</th>
                  <td className="py-4 px-6 text-black font-medium">{job.vacancies}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <th className="py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Qualification Required</th>
                  <td className="py-4 px-6 text-black font-medium">{job.qualification}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <th className="py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Age Limit</th>
                  <td className="py-4 px-6 text-black font-medium">{job.ageLimit}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <th className="py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Salary / Pay Scale</th>
                  <td className="py-4 px-6 text-black font-medium">{job.salary}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <th className="py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Job Location</th>
                  <td className="py-4 px-6 text-black font-medium">{job.location}</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <th className="py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Last Date to Apply</th>
                  <td className="py-4 px-6 text-red-600 font-bold">
                    {job.lastDate ? new Date(job.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Related Updates Section */}
        {relatedUpdates.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-bold text-black flex items-center gap-2">
                <BellRing size={20} className="text-brand" /> 
                Related Updates for this Recruitment
              </h2>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {relatedUpdates.map((update, idx) => (
                <Link 
                  key={idx} 
                  href={update.url}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100 hover:border-brand hover:bg-brand/5 transition-colors group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider rounded w-fit">
                      {update.type}
                    </span>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-brand">
                      {update.title}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Sections or Legacy Fallback */}
        {job.dynamicSections && job.dynamicSections.length > 0 ? (
          <div className="space-y-8 mb-8">
            {job.dynamicSections.map((section: any, idx: number) => {
              
              if (section.blockType === 'DynamicMatrix') {
                return (
                  <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
                    <h2 className="text-xl font-bold text-black mb-4">{section.title}</h2>
                    {section.description && <p className="text-gray-600 mb-4">{section.description}</p>}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="bg-brand/10 text-brand">
                            {section.columns?.map((col: any, i: number) => (
                              <th key={i} className="py-3 px-4 border border-gray-200 font-bold whitespace-nowrap">{col.heading}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.rows?.map((row: any, rIdx: number) => (
                            <tr key={rIdx} className="hover:bg-gray-50 transition-colors">
                              {section.columns?.map((col: any, cIdx: number) => (
                                <td key={cIdx} className="py-3 px-4 border border-gray-200 text-gray-800">
                                  {row.cells?.[cIdx]?.value || '-'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              }

              if (section.blockType === 'KeyValueList') {
                return (
                  <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
                    <h2 className="text-xl font-bold text-black mb-4">{section.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.listItems?.map((item: any, i: number) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 pb-2">
                          <span className="font-semibold text-gray-700">{item.key}:</span>
                          <span className="text-black font-medium">{item.value || '-'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (section.blockType === 'ImportantDates') {
                return (
                  <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
                    <h2 className="text-xl font-bold text-black mb-4">Important Dates</h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {section.dates?.map((d: any, i: number) => (
                        <li key={i}>
                          {d.event} : <strong className={d.event.toLowerCase().includes('last') ? 'text-red-600' : ''}>
                            {d.date ? new Date(d.date).toLocaleDateString('en-IN') : 'N/A'}
                          </strong>
                          {d.note && <span className="ml-2 text-sm text-gray-500">({d.note})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              if (section.blockType === 'ApplicationFee') {
                return (
                  <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
                    <h2 className="text-xl font-bold text-black mb-4">Application Fee</h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                      {section.fees?.map((f: any, i: number) => (
                        <li key={i}>
                          {f.category} : <strong>{f.amount}</strong>
                        </li>
                      ))}
                    </ul>
                    {section.paymentMode && (
                      <div className="text-sm text-gray-600"><strong>Payment Mode:</strong> {section.paymentMode}</div>
                    )}
                  </div>
                );
              }

              if (section.blockType === 'ImportantLinks') {
                return (
                  <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
                    <h2 className="text-xl font-bold text-black mb-4">Important Links</h2>
                    <div className="flex flex-col gap-3">
                      {section.links?.map((link: any, i: number) => (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-bold text-lg">
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }

              // Generic RichText Block
              if (section.title && section.content) {
                return (
                  <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
                    <h2 className="text-xl font-bold text-black mb-4 border-b border-gray-100 pb-2">{section.title}</h2>
                    <div className="prose prose-gray max-w-none text-gray-600">
                      <RichTextParser content={section.content} />
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-black mb-4">Application Details (Legacy)</h2>
            <div className="space-y-6 text-gray-600">
              {job.applicationFee && (
                <div>
                  <h3 className="font-bold text-black mb-2">Application Fee</h3>
                  <p>{job.applicationFee}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-bold text-black mb-2">Important Dates</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Application Start : <strong>{job.applicationStartDate ? new Date(job.applicationStartDate).toLocaleDateString('en-IN') : 'N/A'}</strong></li>
                  <li>Last Date for Apply Online : <strong className="text-red-600">{job.lastDate ? new Date(job.lastDate).toLocaleDateString('en-IN') : 'N/A'}</strong></li>
                  <li>Exam Date : <strong>{job.examDate ? new Date(job.examDate).toLocaleDateString('en-IN') : 'As per Schedule'}</strong></li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This is a legacy listing. Please refer to the official government notification before applying.
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-black text-white font-bold py-3 px-8 rounded-md hover:bg-gray-800 transition-colors text-lg flex items-center justify-center gap-2">
            <Download size={20} /> Download Official Notification
          </button>
          <ApplyButton jobId={String(job.id)} applyUrl={j.applyUrl} className="px-12 text-lg" />
        </div>

      </div>
    </div>
    </>
  );
}
