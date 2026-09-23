import GovJobRow from "@/components/ui/GovJobRow";
import PrivateJobRow from "@/components/ui/PrivateJobRow";
import Link from "next/link";
import { Search, Filter, Briefcase, MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getSavedJobsIds } from "@/app/actions/savedJobs";
import SortDropdown from "@/components/ui/SortDropdown";
import MobileFilterToggle from "@/components/ui/MobileFilterToggle";
import { Metadata, ResolvingMetadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://rozgarx.com';

export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const awaitedParams = await searchParams;
  
  const typeFilter = awaitedParams?.type as string | undefined;
  const categoryFilter = awaitedParams?.category as string | undefined;
  
  let canonicalUrl = `${SITE_URL}/jobs`;
  let shouldIndex = false;

  if (Object.keys(awaitedParams || {}).length === 0) {
    shouldIndex = true;
  } else if (typeFilter === 'government' && categoryFilter && Object.keys(awaitedParams).length === 2) {
    const slug = categoryFilter.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
    canonicalUrl = `${SITE_URL}/government/${slug}`;
  } else if (typeFilter === 'private' && categoryFilter && Object.keys(awaitedParams).length === 2) {
    const slug = categoryFilter.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
    canonicalUrl = `${SITE_URL}/private/${slug}`;
  }

  return {
    title: "Search Jobs - RozgarX",
    description: "Search the latest Government and Private jobs on RozgarX.",
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: shouldIndex,
      follow: true,
    }
  };
}

const getArray = (val: string | string[] | undefined): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
};

const getString = (val: string | string[] | undefined): string | undefined => {
  if (!val) return undefined;
  if (Array.isArray(val)) return val[0];
  return val;
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const awaitedSearchParams = await searchParams;
  
  const typeFilter = getString(awaitedSearchParams?.type);
  const q = getString(awaitedSearchParams?.q);
  const categoryFilter = getString(awaitedSearchParams?.category);
  const locationFilter = getString(awaitedSearchParams?.location);
  const qualificationFilter = getString(awaitedSearchParams?.qualification);
  const experienceFilter = getString(awaitedSearchParams?.experience);
  const salaryFilter = getString(awaitedSearchParams?.salary);
  const sortFilter = getString(awaitedSearchParams?.sort) || (q ? 'relevance' : 'newest');
  const pageFilter = getString(awaitedSearchParams?.page) || '1';
  const isVerified = getString(awaitedSearchParams?.isVerified) === 'true';
  const statusFilter = getString(awaitedSearchParams?.status);
  
  const workModes = getArray(awaitedSearchParams?.workMode);
  const jobTypes = getArray(awaitedSearchParams?.jobType);

  // Construct URL for API call
  const apiUrl = new URL(`${SITE_URL}/api/jobs/search`);
  if (q) apiUrl.searchParams.set('q', q);
  if (typeFilter) apiUrl.searchParams.set('type', typeFilter);
  if (categoryFilter) {
    if (typeFilter === 'government') apiUrl.searchParams.set('govtCategory', categoryFilter);
    else if (typeFilter === 'private') apiUrl.searchParams.set('privateCategory', categoryFilter);
  }
  if (locationFilter) apiUrl.searchParams.set('location', locationFilter);
  if (qualificationFilter) apiUrl.searchParams.set('qualification', qualificationFilter);
  if (experienceFilter) apiUrl.searchParams.set('experience', experienceFilter);
  if (salaryFilter) apiUrl.searchParams.set('salary', salaryFilter);
  if (isVerified) apiUrl.searchParams.set('isVerified', 'true');
  if (statusFilter) apiUrl.searchParams.set('status', statusFilter);
  if (sortFilter) apiUrl.searchParams.set('sort', sortFilter);
  apiUrl.searchParams.set('page', pageFilter);
  apiUrl.searchParams.set('limit', '50'); // Match original limit

  workModes.forEach(wm => apiUrl.searchParams.append('workMode', wm));
  jobTypes.forEach(jt => apiUrl.searchParams.append('jobType', jt));

  // Fetch results from new internal search API
  let jobsData: any = { docs: [], totalDocs: 0, totalPages: 0, page: 1, hasNextPage: false, hasPrevPage: false };
  try {
    const res = await fetch(apiUrl.toString(), { next: { revalidate: 60 } }); // Cache slightly or don't cache
    if (res.ok) {
      jobsData = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch jobs from internal API:", err);
  }

  const jobs = jobsData.docs;
  const savedJobIds = await getSavedJobsIds();
  
  // URL Builder for frontend links
  const buildQuery = (newParams: Record<string, string | null>, toggleArrayValue?: { key: string, value: string }) => {
    const params = new URLSearchParams();
    if (typeFilter) params.set('type', typeFilter);
    if (q) params.set('q', q);
    if (categoryFilter) params.set('category', categoryFilter);
    if (locationFilter) params.set('location', locationFilter);
    if (qualificationFilter) params.set('qualification', qualificationFilter);
    if (experienceFilter) params.set('experience', experienceFilter);
    if (salaryFilter) params.set('salary', salaryFilter);
    if (isVerified) params.set('isVerified', 'true');
    if (statusFilter) params.set('status', statusFilter);
    if (sortFilter && sortFilter !== (q ? 'relevance' : 'newest')) params.set('sort', sortFilter);
    
    // Arrays
    let currentWorkModes = [...workModes];
    let currentJobTypes = [...jobTypes];

    if (toggleArrayValue) {
      if (toggleArrayValue.key === 'workMode') {
        if (currentWorkModes.includes(toggleArrayValue.value)) {
          currentWorkModes = currentWorkModes.filter(v => v !== toggleArrayValue.value);
        } else {
          currentWorkModes.push(toggleArrayValue.value);
        }
      }
      if (toggleArrayValue.key === 'jobType') {
        if (currentJobTypes.includes(toggleArrayValue.value)) {
          currentJobTypes = currentJobTypes.filter(v => v !== toggleArrayValue.value);
        } else {
          currentJobTypes.push(toggleArrayValue.value);
        }
      }
    }

    currentWorkModes.forEach(wm => params.append('workMode', wm));
    currentJobTypes.forEach(jt => params.append('jobType', jt));
    
    // Overrides
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else if (value) params.set(key, value);
    });
    
    return `/jobs?${params.toString()}`;
  };

  // Active filters list for chips
  const activeFilters: { label: string; key: string; arrayValue?: string }[] = [];
  if (q) activeFilters.push({ label: `"${q}"`, key: 'q' });
  if (typeFilter) activeFilters.push({ label: typeFilter === 'government' ? 'Government' : 'Private', key: 'type' });
  if (categoryFilter) activeFilters.push({ label: categoryFilter, key: 'category' });
  if (locationFilter) activeFilters.push({ label: locationFilter, key: 'location' });
  if (qualificationFilter) activeFilters.push({ label: qualificationFilter, key: 'qualification' });
  if (experienceFilter) activeFilters.push({ label: experienceFilter, key: 'experience' });
  if (salaryFilter) activeFilters.push({ label: salaryFilter, key: 'salary' });
  if (isVerified) activeFilters.push({ label: 'Verified Only', key: 'isVerified' });
  if (statusFilter) activeFilters.push({ label: statusFilter, key: 'status' });
  workModes.forEach(wm => activeFilters.push({ label: wm, key: 'workMode', arrayValue: wm }));
  jobTypes.forEach(jt => activeFilters.push({ label: jt, key: 'jobType', arrayValue: jt }));

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Explore Jobs</h1>
          <p className="text-gray-600">Find the best {typeFilter ? typeFilter : ''} jobs that match your profile.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <div className="w-full lg:w-1/4">
            <MobileFilterToggle>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <div className="flex items-center justify-between font-bold text-lg border-b border-gray-100 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Filter size={20} className="text-brand" />
                    Filters
                  </div>
                  {activeFilters.length > 0 && (
                    <Link href="/jobs" className="text-sm text-brand font-medium hover:underline">
                      Clear All
                    </Link>
                  )}
                </div>
                
                <div className="space-y-6">
                  {/* Job Type Filter */}
                  {!typeFilter && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 text-sm">Job Sector</h3>
                      <div className="space-y-2">
                        <Link href={`/jobs`} className={`block px-3 py-2 rounded-lg text-sm transition-colors bg-brand/10 text-brand font-medium`}>
                          All Sectors
                        </Link>
                        <Link href={`/jobs?type=government`} className={`block px-3 py-2 rounded-lg text-sm transition-colors text-gray-600 hover:bg-gray-50`}>
                          Government Jobs
                        </Link>
                        <Link href={`/jobs?type=private`} className={`block px-3 py-2 rounded-lg text-sm transition-colors text-gray-600 hover:bg-gray-50`}>
                          Private Jobs
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  {/* Status & Verification */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-sm">Status</h3>
                    <div className="space-y-2">
                      <Link href={buildQuery({ status: statusFilter === 'open' ? null : 'open' })} className={`block px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === 'open' ? 'bg-brand/10 text-brand font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                        Open
                      </Link>
                      <Link href={buildQuery({ status: statusFilter === 'closing soon' ? null : 'closing soon' })} className={`block px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === 'closing soon' ? 'bg-brand/10 text-brand font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                        Closing Soon
                      </Link>
                      <Link href={buildQuery({ isVerified: isVerified ? null : 'true' })} className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isVerified ? 'bg-brand/10 text-brand font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                        Verified Official
                      </Link>
                    </div>
                  </div>

                  {/* Government Filters */}
                  {typeFilter === 'government' && (
                    <>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Category</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                          {['SSC', 'UPSC', 'Railway', 'Banking', 'Defence', 'Police', 'Teaching', 'State Government'].map(cat => (
                            <Link key={cat} href={buildQuery({ category: categoryFilter === cat ? null : cat })} className={`block px-3 py-2 rounded-lg text-sm transition-colors ${categoryFilter === cat ? 'bg-brand text-white font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                              {cat}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Private Filters */}
                  {typeFilter === 'private' && (
                    <>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Category</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                          {['IT & Software', 'Engineering', 'Finance', 'Sales', 'Marketing', 'Healthcare', 'BPO', 'Internship', 'Remote'].map(cat => (
                            <Link key={cat} href={buildQuery({ category: categoryFilter === cat ? null : cat })} className={`block px-3 py-2 rounded-lg text-sm transition-colors ${categoryFilter === cat ? 'bg-brand text-white font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                              {cat}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Work Mode</h3>
                        <div className="space-y-2">
                          {['On-site', 'Hybrid', 'Remote'].map(mode => {
                            const isActive = workModes.includes(mode);
                            return (
                              <Link key={mode} href={buildQuery({}, { key: 'workMode', value: mode })} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-brand/10 text-brand font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <div className={`w-4 h-4 rounded border mr-2 flex items-center justify-center ${isActive ? 'bg-brand border-brand text-white' : 'border-gray-300'}`}>
                                  {isActive && <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3"><path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                </div>
                                {mode}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Job Type</h3>
                        <div className="space-y-2">
                          {['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map(jt => {
                            const isActive = jobTypes.includes(jt);
                            return (
                              <Link key={jt} href={buildQuery({}, { key: 'jobType', value: jt })} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-brand/10 text-brand font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <div className={`w-4 h-4 rounded border mr-2 flex items-center justify-center ${isActive ? 'bg-brand border-brand text-white' : 'border-gray-300'}`}>
                                  {isActive && <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3"><path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                </div>
                                {jt}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Common Inputs */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">Location</h3>
                      <form action="/jobs" method="GET">
                        <input type="text" name="location" defaultValue={locationFilter || ''} placeholder="e.g. Delhi, Remote" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
                        {/* Preserve other state */}
                        {typeFilter && <input type="hidden" name="type" value={typeFilter} />}
                        {q && <input type="hidden" name="q" value={q} />}
                        {workModes.map(wm => <input key={wm} type="hidden" name="workMode" value={wm} />)}
                      </form>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">Qualification</h3>
                      <form action="/jobs" method="GET">
                        <input type="text" name="qualification" defaultValue={qualificationFilter || ''} placeholder="e.g. 10th, Graduate" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
                        {typeFilter && <input type="hidden" name="type" value={typeFilter} />}
                        {q && <input type="hidden" name="q" value={q} />}
                      </form>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">Salary</h3>
                      <form action="/jobs" method="GET">
                        <input type="text" name="salary" defaultValue={salaryFilter || ''} placeholder="e.g. 50000, 5LPA" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand" />
                        {typeFilter && <input type="hidden" name="type" value={typeFilter} />}
                        {q && <input type="hidden" name="q" value={q} />}
                      </form>
                    </div>
                  </div>

                </div>
              </div>
            </MobileFilterToggle>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            
            {/* Search Bar inside Jobs page */}
            <form action="/jobs" method="GET" className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-2 mb-4">
              <div className="flex-1 flex items-center px-3 w-full">
                <Search className="text-gray-400 mr-2" size={20} />
                <input 
                  type="text" 
                  name="q"
                  defaultValue={q || ''}
                  placeholder="Search by job title, company, or skills..." 
                  className="w-full py-2 text-black focus:outline-none placeholder:text-gray-400 text-sm font-medium"
                />
              </div>
              {/* Preserve state */}
              {typeFilter && <input type="hidden" name="type" value={typeFilter} />}
              {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
              {locationFilter && <input type="hidden" name="location" value={locationFilter} />}
              <button type="submit" className="w-full md:w-auto bg-brand hover:bg-brand-hover text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-sm">
                Search
              </button>
            </form>

            {/* Active Filters Chips */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeFilters.map(filter => {
                  let href = buildQuery({ [filter.key]: null });
                  if (filter.arrayValue) href = buildQuery({}, { key: filter.key, value: filter.arrayValue });
                  return (
                    <Link key={`${filter.key}-${filter.label}`} href={href} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand hover:bg-brand/20 transition-colors">
                      {filter.label}
                      <X size={14} className="ml-1.5" />
                    </Link>
                  );
                })}
                <Link href={typeFilter ? `/jobs?type=${typeFilter}` : "/jobs"} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors">
                  Clear All
                </Link>
              </div>
            )}

            {/* Results Count & Sorting */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <div className="text-sm text-gray-500 font-medium">
                Showing <span className="text-gray-900 font-bold">{jobsData.totalDocs}</span> jobs
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Sort by:</span>
                <SortDropdown initialSort={sortFilter} />
              </div>
            </div>

            {/* Job List */}
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
                  <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No jobs found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search query.</p>
                  <Link href={typeFilter ? `/jobs?type=${typeFilter}` : "/jobs"} className="inline-block mt-4 text-brand font-medium hover:underline">
                    Clear all filters
                  </Link>
                </div>
              ) : (
                jobs.map((job: any) => (
                  job.type === 'government' ? (
                    <GovJobRow key={job.id} job={job as any} isSaved={savedJobIds.includes(job.id)} />
                  ) : (
                    <PrivateJobRow key={job.id} job={job as any} isSaved={savedJobIds.includes(job.id)} />
                  )
                ))
              )}
            </div>

            {/* Pagination */}
            {jobsData.totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                {jobsData.hasPrevPage ? (
                  <Link href={buildQuery({ page: jobsData.prevPage.toString() })} className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    <ChevronLeft size={20} />
                  </Link>
                ) : (
                  <button disabled className="p-2 rounded-lg border border-gray-100 text-gray-300 cursor-not-allowed">
                    <ChevronLeft size={20} />
                  </button>
                )}
                
                <span className="text-sm font-medium text-gray-700 px-4">
                  Page {jobsData.page} of {jobsData.totalPages}
                </span>

                {jobsData.hasNextPage ? (
                  <Link href={buildQuery({ page: jobsData.nextPage.toString() })} className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    <ChevronRight size={20} />
                  </Link>
                ) : (
                  <button disabled className="p-2 rounded-lg border border-gray-100 text-gray-300 cursor-not-allowed">
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

