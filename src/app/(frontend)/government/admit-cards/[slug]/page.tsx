import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Building2, CheckCircle, ExternalLink, ArrowRight } from "lucide-react";
import { getPayload } from "@/lib/payload";
import configPromise from '@payload-config';
import RichTextParser from "@/components/RichTextParser";

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://rozgarx.com';

function extractText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  let text = '';
  if (node.text) text += node.text;
  if (node.children) {
    for (const child of node.children) {
      text += extractText(child);
    }
  }
  return text;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload();

  try {
    const res = await payload.find({
      collection: 'admit-cards' as any,
      where: {
        and: [
          { slug: { equals: slug } },
          { isPublished: { equals: true } }
        ]
      },
      limit: 1,
    });
    const admitCard = res.docs[0] as any;
    if (!admitCard) return { title: 'Admit Card Not Found' };
    
    const descText = extractText(admitCard.instructions).substring(0, 160) + '...';
    
    return {
      title: `${admitCard.title} - RozgarX`,
      description: descText || `Download the latest admit card for ${admitCard.examName} by ${admitCard.organization} on RozgarX.`,
      alternates: {
        canonical: `${SITE_URL}/government/admit-cards/${admitCard.slug}`,
      },
      openGraph: {
        title: `${admitCard.title} - RozgarX`,
        description: descText,
        url: `${SITE_URL}/government/admit-cards/${admitCard.slug}`,
        type: 'article',
      }
    };
  } catch (e) {
    return { title: 'RozgarX' };
  }
}

export default async function AdmitCardDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getPayload();

  let admitCard;
  let relatedJob = null;
  try {
    const res = await payload.find({
      collection: 'admit-cards' as any,
      where: {
        and: [
          { slug: { equals: slug } },
          { isPublished: { equals: true } }
        ]
      },
      limit: 1,
      depth: 1,
    });
    admitCard = res.docs[0] as any;
    
    if (admitCard?.relatedJob && typeof admitCard.relatedJob === 'object') {
      relatedJob = admitCard.relatedJob;
    }
  } catch (e) {
    // console.error(e);
  }

  if (!admitCard) {
    notFound();
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
      { '@type': 'ListItem', 'position': 2, 'name': 'Government Hub', 'item': `${SITE_URL}/government` },
      { '@type': 'ListItem', 'position': 3, 'name': 'Admit Cards', 'item': `${SITE_URL}/government#admit-cards` },
      { '@type': 'ListItem', 'position': 4, 'name': admitCard.title }
    ]
  };

  const isUpcoming = admitCard.status === 'Upcoming';

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
          <span className="text-black font-medium">{admitCard.title}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-t-lg p-6 md:p-8 border-x border-t border-gray-200 border-b-4 border-b-brand mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded ${isUpcoming ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                  {admitCard.status}
                </span>
                {admitCard.isVerified && (
                  <span className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    <CheckCircle className="w-3 h-3 mr-1" /> Official Source Verified
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {admitCard.title}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                  {admitCard.organization}
                </div>
              </div>
            </div>
            
            {/* CTA */}
            {admitCard.officialUrl && !isUpcoming && (
              <div className="shrink-0 mt-4 md:mt-0">
                <a 
                  href={admitCard.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full md:w-auto px-6 py-3 bg-brand text-white font-medium rounded-md hover:bg-brand-dark transition-colors shadow-sm"
                >
                  Download Official Admit Card <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Key Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Admit Card Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Exam Name</div>
                  <div className="font-medium text-gray-900">{admitCard.examName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Organization</div>
                  <div className="font-medium text-gray-900">{admitCard.organization}</div>
                </div>
                {admitCard.examDate && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Exam Date</div>
                    <div className="font-medium text-gray-900">
                      {new Date(admitCard.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                )}
                {admitCard.admitCardReleaseDate && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Admit Card Release Date</div>
                    <div className="font-medium text-gray-900">
                      {new Date(admitCard.admitCardReleaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description / Rich Text */}
            {admitCard.instructions && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Important Instructions</h2>
                <div className="prose prose-sm md:prose-base max-w-none text-gray-700">
                  <RichTextParser content={admitCard.instructions} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Related Job */}
            {relatedJob && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Related Recruitment</h3>
                <p className="text-sm text-gray-600 mb-4">View the original recruitment details for this admit card.</p>
                <Link 
                  href={`/jobs/government/${relatedJob.id}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100 hover:border-brand hover:bg-brand/5 transition-colors group"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 group-hover:text-brand line-clamp-2">
                      {relatedJob.title}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand shrink-0 ml-2" />
                </Link>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-amber-50 rounded-lg p-5 border border-amber-100">
              <h3 className="text-sm font-bold text-amber-800 mb-2">Disclaimer</h3>
              <p className="text-xs text-amber-700 leading-relaxed">
                RozgarX is an informational platform. We are not an official government body. Candidates are strictly advised to cross-check all exam dates and download admit cards via the official website provided.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
