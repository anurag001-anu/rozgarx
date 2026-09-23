import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { getPayload } from "@/lib/payload";
import configPromise from '@payload-config';
import PrivateJobRow from "@/components/ui/PrivateJobRow";
import { getSavedJobsIds } from "@/app/actions/savedJobs";

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://rozgarx.com';

function formatCategoryString(cat: string) {
  if (cat === 'it-software') return 'IT & Software';
  if (cat === 'bpo') return 'BPO';
  return cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const formattedCat = formatCategoryString(decodedCategory);
  
  const payload = await getPayload();
  const jobsRes = await payload.find({
    collection: 'jobs',
    where: {
      and: [
        { type: { equals: 'private' } },
        { privateCategory: { equals: formattedCat } },
        { status: { in: ['Open', 'Closing Soon'] } },
      ]
    },
    limit: 1
  });

  const hasJobs = jobsRes.totalDocs > 0;

  return {
    title: `${formattedCat} Jobs - RozgarX`,
    description: `Find the latest ${formattedCat} jobs, remote work, and private sector opportunities on RozgarX.`,
    alternates: {
      canonical: `${SITE_URL}/private/${category}`,
    },
    robots: {
      index: hasJobs,
      follow: true,
    }
  };
}

export default async function PrivateCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const formattedCat = formatCategoryString(decodedCategory);

  const payload = await getPayload();
  const jobsRes = await payload.find({
    collection: 'jobs',
    where: {
      and: [
        { type: { equals: 'private' } },
        { privateCategory: { equals: formattedCat } },
      ]
    },
    sort: '-createdAt',
    limit: 50,
  });

  const jobs = jobsRes.docs;
  const savedJobIds = await getSavedJobsIds();

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12">
      <div className="container-custom max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-brand transition-colors">Home</Link>
          <span>/</span>
          <Link href="/private" className="hover:text-brand transition-colors">Private Jobs</Link>
          <span>/</span>
          <span className="text-black font-medium">{formattedCat}</span>
        </nav>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
              <Building2 size={32} className="text-brand" />
              {formattedCat} Jobs
            </h1>
            <p className="text-gray-500 text-lg">
              Found {jobsRes.totalDocs} {jobsRes.totalDocs === 1 ? 'job' : 'jobs'} in this category.
            </p>
          </div>
          <Link href="/private" className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-brand font-medium transition-colors bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-brand/30 shadow-sm">
            <ArrowLeft size={18} /> Back to Hub
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
            <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No active jobs found</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              There are currently no active openings for {formattedCat}. Check back later or browse other categories.
            </p>
            <Link href="/private" className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors">
              <ArrowLeft size={18} /> Explore Private Hub
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <PrivateJobRow 
                key={job.id} 
                job={job as any} 
                isSaved={savedJobIds.includes(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
