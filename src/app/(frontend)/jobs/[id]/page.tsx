import { getPayload } from "@/lib/payload";
import { notFound } from "next/navigation";
import { Building2, MapPin, DollarSign, Calendar, Briefcase, Clock, FileText, Landmark, Users, GraduationCap, Link as LinkIcon, FileCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import ApplyModal from "@/components/ui/ApplyModal";
import { getSavedJobsIds } from "@/app/actions/savedJobs";
import { SaveJobButton } from "@/components/ui/SaveJobButton";

// Helper to extract text from Payload Lexical AST
function extractText(node: any): string {
  if (typeof node === 'string') return node;
  if (!node) return '';
  if (node.text) return node.text;
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractText).join(' ');
  }
  return '';
}

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload();
  const awaitedParams = await params;
  
  let job: any;
  try {
    job = await payload.findByID({
      collection: "jobs",
      id: awaitedParams.id,
      depth: 1, // To fetch relationship details like company
    });
  } catch (error) {
    return notFound();
  }

  if (!job) {
    return notFound();
  }

  const isGovt = job.type === 'government';
  const descriptionText = extractText(job.description);
  
  // Determine status dynamically
  let displayStatus = job.status || 'Open';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (job.lastDate) {
    const lastDate = new Date(job.lastDate);
    const diffDays = Math.ceil((lastDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    if (diffDays < 0) displayStatus = 'Closed';
    else if (diffDays <= 3) displayStatus = 'Closing Soon';
  }
  if (job.status === 'Closed') displayStatus = 'Closed';
  
  const isClosed = displayStatus === 'Closed';
  
  const savedJobIds = await getSavedJobsIds();
  const isSaved = savedJobIds.includes(job.id);

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12">
      <div className="container-custom max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back link */}
        <Link href={isGovt ? "/jobs?type=government" : "/jobs?type=private"} className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-brand mb-6 transition-colors">
          &larr; Back to {isGovt ? 'Government' : 'Private'} jobs
        </Link>

        {/* Job Header Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            {isGovt ? <Landmark size={120} /> : <Building2 size={120} />}
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
            
            {/* Logo Placeholder */}
            <div className="w-24 h-24 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
              <span className="text-4xl font-black text-gray-300">
                {isGovt ? (job.organization ? job.organization.charAt(0) : '🏛️') : (typeof job.company === 'object' && job.company?.name ? job.company.name.charAt(0) : '🏢')}
              </span>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${isGovt ? 'bg-blue-100 text-blue-700' : 'bg-brand/10 text-brand'}`}>
                  {isGovt ? 'Government Job' : 'Private Job'}
                </span>
                {job.govtCategory && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                    {job.govtCategory}
                  </span>
                )}
                {job.privateCategory && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                    {job.privateCategory}
                  </span>
                )}
                {isClosed ? (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                    Closed
                  </span>
                ) : displayStatus === 'Closing Soon' ? (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                    Closing Soon
                  </span>
                ) : null}
              </div>
              
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{job.title}</h1>
              
              <div className="text-lg text-gray-600 font-medium mb-4 flex items-center gap-2">
                {isGovt ? (
                  <><Landmark size={20} className="text-gray-400"/> {job.organization || 'Government Department'}</>
                ) : (
                  <><Building2 size={20} className="text-gray-400"/> {typeof job.company === 'object' && job.company ? job.company.name : 'Unknown Company'}</>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-medium">
                <div className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400" /> {job.location}</div>
                {job.salary && <div className="flex items-center gap-1.5"><DollarSign size={16} className="text-gray-400" /> {job.salary}</div>}
                {job.experience && <div className="flex items-center gap-1.5"><Briefcase size={16} className="text-gray-400" /> {job.experience}</div>}
                {job.workMode && <div className="flex items-center gap-1.5"><Building2 size={16} className="text-gray-400" /> {job.workMode}</div>}
              </div>
            </div>
            
            <div className="w-full md:w-auto flex flex-col gap-3 shrink-0">
              {isClosed ? (
                <button disabled className="w-full md:w-auto bg-gray-300 text-gray-500 font-bold py-4 px-10 rounded-xl cursor-not-allowed">
                  Applications Closed
                </button>
              ) : job.applyUrl ? (
                <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto bg-brand hover:bg-brand-hover text-white font-bold py-4 px-10 rounded-xl transition-all text-center flex items-center justify-center gap-2">
                  Apply Now <LinkIcon size={18} />
                </a>
              ) : (
                <button disabled className="w-full md:w-auto bg-gray-200 text-gray-600 font-bold py-4 px-10 rounded-xl cursor-not-allowed">
                  Link Unavailable
                </button>
              )}
              
              <div className="w-full md:w-auto bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all">
                <SaveJobButton jobId={job.id} initialIsSaved={isSaved} className="w-full font-bold py-4 px-10 flex gap-2" iconSize={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <FileText size={24} className="text-brand" /> Job Description
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
                <p>{descriptionText}</p>
              </div>
              
              {job.skills && !isGovt && (
                <div className="mt-8">
                  <h3 className="font-bold text-gray-900 mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.split(',').map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isGovt && (
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                  <Landmark size={24} className="text-brand" /> Official Job Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 mb-1">Advertisement No.</h4>
                    <p className="font-medium text-gray-900">{job.advertisementNumber || 'Not Specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 mb-1">Total Vacancies</h4>
                    <p className="font-medium text-gray-900">{job.vacancies || 'Not Specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 mb-1">Qualification</h4>
                    <p className="font-medium text-gray-900">{job.qualification || 'Not Specified'}</p>
                  </div>
                  {(!job.dynamicSections || job.dynamicSections.length === 0) && (
                    <>
                      <div>
                        <h4 className="text-sm font-bold text-gray-500 mb-1">Age Limit</h4>
                        <p className="font-medium text-gray-900">{job.ageLimit || 'Not Specified'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-500 mb-1">Application Fee</h4>
                        <p className="font-medium text-gray-900">{job.applicationFee || 'Not Specified'}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 mb-1">Salary / Pay Level</h4>
                    <p className="font-medium text-gray-900">{job.salary || 'As per rules'}</p>
                  </div>
                </div>

                {job.dynamicSections && job.dynamicSections.length > 0 ? (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-brand font-bold mb-4">This job has detailed dynamic sections.</p>
                    <a href={`/jobs/government/${job.id}`} className="inline-block bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-hover transition-colors">
                      View Full Details
                    </a>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Important Dates</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-3">
                        <Calendar className="text-brand opacity-70" size={20} />
                        <div>
                          <div className="text-xs font-bold text-gray-500">Start Date</div>
                          <div className="font-medium text-sm text-gray-900">{job.applicationStartDate ? new Date(job.applicationStartDate).toLocaleDateString() : 'N/A'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="text-rose-500 opacity-70" size={20} />
                        <div>
                          <div className="text-xs font-bold text-gray-500">Last Date</div>
                          <div className="font-bold text-sm text-rose-600">{job.lastDate ? new Date(job.lastDate).toLocaleDateString() : 'N/A'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="text-gray-400" size={20} />
                        <div>
                          <div className="text-xs font-bold text-gray-500">Correction Date</div>
                          <div className="font-medium text-sm text-gray-900">{job.correctionDate ? new Date(job.correctionDate).toLocaleDateString() : 'N/A'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="text-gray-400" size={20} />
                        <div>
                          <div className="text-xs font-bold text-gray-500">Exam Date</div>
                          <div className="font-medium text-sm text-gray-900">{job.examDate ? new Date(job.examDate).toLocaleDateString() : 'To be notified'}</div>
                        </div>
                      </div>
                    </div>

                    {(job.selectionProcess || job.requiredDocuments) && (
                      <>
                        <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Process & Requirements</h3>
                        {job.selectionProcess && (
                          <div className="mb-4">
                            <h4 className="text-sm font-bold text-gray-500 mb-1">Selection Process</h4>
                            <p className="text-sm text-gray-700">{job.selectionProcess}</p>
                          </div>
                        )}
                        {job.requiredDocuments && (
                          <div>
                            <h4 className="text-sm font-bold text-gray-500 mb-1">Required Documents</h4>
                            <p className="text-sm text-gray-700">{job.requiredDocuments}</p>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Official Source Verification Box */}
            {job.isVerified && (
              <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle2 size={64} /></div>
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 relative z-10">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="font-bold text-emerald-800 mb-1 relative z-10">Official Source Verified</h3>
                <p className="text-xs text-emerald-600 font-medium relative z-10">
                  Verified by Admin on {job.verifiedDate ? new Date(job.verifiedDate).toLocaleDateString() : 'Recent'}
                </p>
              </div>
            )}

            {/* Official Links Box */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Important Links</h3>
              <div className="space-y-3">
                {job.officialNotificationUrl ? (
                  <a href={job.officialNotificationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm group">
                    <span className="text-gray-700 font-medium group-hover:text-brand transition-colors flex items-center gap-2">
                      <FileCheck size={16} className="text-gray-400" /> Official Notification
                    </span>
                    <LinkIcon size={14} className="text-gray-400 group-hover:text-brand transition-colors" />
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-400 font-medium"><FileCheck size={16} /> Notification Not Available</div>
                )}
                
                {job.officialWebsiteUrl ? (
                  <a href={job.officialWebsiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm group pt-2 border-t border-gray-50">
                    <span className="text-gray-700 font-medium group-hover:text-brand transition-colors flex items-center gap-2">
                      <Building2 size={16} className="text-gray-400" /> Official Website
                    </span>
                    <LinkIcon size={14} className="text-gray-400 group-hover:text-brand transition-colors" />
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-400 font-medium pt-2 border-t border-gray-50"><Building2 size={16} /> Website Not Available</div>
                )}
                
                {!isGovt && job.companyWebsiteUrl && (
                  <a href={job.companyWebsiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm group pt-2 border-t border-gray-50">
                    <span className="text-gray-700 font-medium group-hover:text-brand transition-colors flex items-center gap-2">
                      <Building2 size={16} className="text-gray-400" /> Company Website
                    </span>
                    <LinkIcon size={14} className="text-gray-400 group-hover:text-brand transition-colors" />
                  </a>
                )}
              </div>
            </div>
            
            {!isGovt && typeof job.company === 'object' && job.company && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">About Company</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center font-bold text-gray-400">
                    {job.company.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{job.company.name}</div>
                    <Link href={`/companies/${job.company.id}`} className="text-sm text-brand hover:underline font-medium">View Profile</Link>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Industry</span>
                    <span className="font-medium text-gray-900">{job.company.industry || 'Not Specified'}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100 text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Act Fast</h3>
              <p className="text-sm text-gray-600 mb-4">This job was posted on {new Date(job.createdAt).toLocaleDateString()}. Apply early to increase your chances!</p>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
