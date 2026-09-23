import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Building2, CheckCircle, ExternalLink, ArrowRight, FileText } from "lucide-react";
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
      collection: 'syllabuses' as any,
      where: {
        and: [
          { slug: { equals: slug } },
          { isPublished: { equals: true } }
        ]
      },
      limit: 1,
    });
    const syllabus = res.docs[0] as any;
    if (!syllabus) return { title: 'Syllabus Not Found' };
    
    let descText = extractText(syllabus.content).substring(0, 160);
    if (descText) descText += '...';
    
    return {
      title: `${syllabus.title} - RozgarX`,
      description: descText || `View and download the complete syllabus for ${syllabus.title} by ${syllabus.organization} on RozgarX.`,
      alternates: {
        canonical: `${SITE_URL}/government/syllabuses/${syllabus.slug}`,
      },
      openGraph: {
        title: `${syllabus.title} - RozgarX`,
        description: descText,
        url: `${SITE_URL}/government/syllabuses/${syllabus.slug}`,
        type: 'article',
      }
    };
  } catch (e) {
    return { title: 'RozgarX' };
  }
}

export default async function SyllabusDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getPayload();

  let syllabus;
  let relatedJob = null;
  try {
    const res = await payload.find({
      collection: 'syllabuses' as any,
      where: {
        and: [
          { slug: { equals: slug } },
          { isPublished: { equals: true } }
        ]
      },
      limit: 1,
      depth: 1,
    });
    syllabus = res.docs[0] as any;
    
    if (syllabus?.relatedJob && typeof syllabus.relatedJob === 'object') {
      relatedJob = syllabus.relatedJob;
    }
  } catch (e) {
    // console.error(e);
  }

  if (!syllabus) {
    notFound();
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
      { '@type': 'ListItem', 'position': 2, 'name': 'Government Hub', 'item': `${SITE_URL}/government` },
      { '@type': 'ListItem', 'position': 3, 'name': 'Syllabus', 'item': `${SITE_URL}/government#syllabus` },
      { '@type': 'ListItem', 'position': 4, 'name': syllabus.title }
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
          <span className="text-black font-medium">{syllabus.title}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-t-lg p-6 md:p-8 border-x border-t border-gray-200 border-b-4 border-b-brand mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider rounded">
                  Syllabus
                </span>
                {syllabus.isVerified && (
                  <span className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    <CheckCircle className="w-3 h-3 mr-1" /> Official Source Verified
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {syllabus.title}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                  {syllabus.organization}
                </div>
                {syllabus.subject && (
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-gray-400" />
                    {syllabus.subject}
                  </div>
                )}
              </div>
            </div>
            
            {/* CTA */}
            {syllabus.officialUrl && (
              <div className="shrink-0 mt-4 md:mt-0">
                <a 
                  href={syllabus.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full md:w-auto px-6 py-3 bg-brand text-white font-medium rounded-md hover:bg-brand-dark transition-colors shadow-sm"
                >
                  Download Official Syllabus <ExternalLink className="ml-2 w-4 h-4" />
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
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Syllabus Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Exam / Title Name</div>
                  <div className="font-medium text-gray-900">{syllabus.title}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Organization</div>
                  <div className="font-medium text-gray-900">{syllabus.organization}</div>
                </div>
                {syllabus.examLevel && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Exam Level</div>
                    <div className="font-medium text-gray-900">{syllabus.examLevel}</div>
                  </div>
                )}
                {syllabus.qualification && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Qualification</div>
                    <div className="font-medium text-gray-900">{syllabus.qualification}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Description / Rich Text */}
            {syllabus.content && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Detailed Syllabus</h2>
                <div className="prose prose-sm md:prose-base max-w-none text-gray-700">
                  <RichTextParser content={syllabus.content} />
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
                <p className="text-sm text-gray-600 mb-4">View the original recruitment details for this syllabus.</p>
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
                RozgarX is an informational platform. Candidates are strictly advised to cross-check all syllabus details via the official notification/website provided.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
