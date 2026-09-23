import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Calendar, Building2, Search, ArrowRight, BookOpen } from 'lucide-react';
import { getPayload } from '@/lib/payload';
import configPromise from '@payload-config';

export const metadata: Metadata = {
  title: 'Government Exam Syllabuses & Exam Patterns - RozgarX',
  description: 'Download the latest official syllabuses and exam patterns for government exams including SSC, UPSC, and State Govt jobs.',
};

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://rozgarx.com';

export default async function SyllabusesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;
  const validPage = isNaN(page) || page < 1 ? 1 : page;
  
  const payload = await getPayload();
  
  const limit = 20;
  
  const syllabusesData = await payload.find({
    collection: 'syllabuses' as any,
    page: validPage,
    limit: limit,
    sort: '-updatedAt',
    where: {
      and: [
        { isPublished: { equals: true } },
        { isArchived: { not_equals: true } }
      ]
    }
  });

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
      { '@type': 'ListItem', 'position': 2, 'name': 'Government Hub', 'item': `${SITE_URL}/government` },
      { '@type': 'ListItem', 'position': 3, 'name': 'Syllabuses' }
    ]
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="container-custom max-w-5xl">
        
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex gap-2 flex-wrap">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span>/</span>
          <Link href="/government" className="hover:text-brand">Government Hub</Link>
          <span>/</span>
          <span className="text-black font-medium">Syllabuses</span>
        </nav>

        <div className="bg-white rounded-t-lg p-6 md:p-8 border-x border-t border-gray-200 border-b-4 border-b-brand mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Exam Syllabuses</h1>
            <p className="text-gray-600">Download official syllabuses and exam patterns to prepare for your next exam.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="divide-y divide-gray-100">
            {syllabusesData.docs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No syllabuses published yet.</p>
              </div>
            ) : (
              syllabusesData.docs.map((doc: any) => (
                <Link 
                  key={doc.id} 
                  href={`/government/syllabuses/${doc.slug}`}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-brand/5 transition-colors group block"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand mb-1 line-clamp-2">
                      {doc.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                      <span className="flex items-center"><Building2 className="w-3.5 h-3.5 mr-1" /> {doc.organization}</span>
                      {doc.subject && (
                        <span className="flex items-center"><BookOpen className="w-3.5 h-3.5 mr-1" /> {doc.subject}</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center text-sm font-medium text-brand group-hover:translate-x-1 transition-transform">
                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        {syllabusesData.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {syllabusesData.hasPrevPage && (
              <Link 
                href={`/government/syllabuses?page=${syllabusesData.prevPage}`}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium text-gray-700"
              >
                Previous
              </Link>
            )}
            <span className="text-sm text-gray-600 px-4">
              Page {syllabusesData.page} of {syllabusesData.totalPages}
            </span>
            {syllabusesData.hasNextPage && (
              <Link 
                href={`/government/syllabuses?page=${syllabusesData.nextPage}`}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium text-gray-700"
              >
                Next
              </Link>
            )}
          </div>
        )}

      </div>
    </div>
    </>
  );
}
