import { getPayload } from "@/lib/payload";
import CompanyRow from "@/components/ui/CompanyRow";
import { Search, Building2 } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Companies - RozgarX",
  description: "Discover top organizations actively hiring. Explore their profiles and find your next opportunity.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://rozgarx.com'}/companies`,
  },
};

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const payload = await getPayload();
  const awaitedSearchParams = await searchParams;
  const q = typeof awaitedSearchParams?.q === 'string' ? awaitedSearchParams.q : undefined;
  const industry = typeof awaitedSearchParams?.industry === 'string' ? awaitedSearchParams.industry : undefined;

  let where: any = { isPublished: { equals: true } };
  if (q) {
    where.name = { like: q };
  }
  if (industry) {
    where.industry = { equals: industry };
  }

  const companiesRes = await payload.find({
    collection: "companies",
    where,
    sort: "-createdAt",
    limit: 50,
  });

  const companies = companiesRes.docs;

  // Fetch unique industries for filter
  const allCompanies = await payload.find({
    collection: 'companies',
    where: { isPublished: { equals: true } },
    limit: 1000,
    select: { industry: true }
  });
  
  const industryCounts: Record<string, number> = {};
  allCompanies.docs.forEach((c: any) => {
    if (c.industry) {
      industryCounts[c.industry] = (industryCounts[c.industry] || 0) + 1;
    }
  });
  const topIndustries = Object.entries(industryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Top Companies</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover top organizations actively hiring. Explore their profiles and find your next opportunity.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="max-w-2xl mx-auto mb-10">
          <form action="/companies" method="GET" className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex items-center gap-2">
            <div className="flex-1 flex items-center px-4">
              <Search className="text-gray-400 mr-3" size={20} />
              <input 
                type="text" 
                name="q"
                defaultValue={q || ''}
                placeholder="Search for companies by name..." 
                className="w-full py-3 text-black focus:outline-none placeholder:text-gray-400 text-base font-medium"
              />
            </div>
            {industry && <input type="hidden" name="industry" value={industry} />}
            <button type="submit" className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-colors text-sm">
              Search
            </button>
          </form>

          {/* Industry Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Link 
              href="/companies"
              className={`px-4 py-1.5 border rounded-full text-sm font-medium transition-all ${!industry ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600 hover:border-brand hover:text-brand bg-white'}`}
            >
              All Industries
            </Link>
            {topIndustries.slice(0, 8).map((ind) => (
              <Link 
                key={ind} 
                href={`/companies?industry=${encodeURIComponent(ind)}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                className={`px-4 py-1.5 border rounded-full text-sm font-medium transition-all ${industry === ind ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-600 hover:border-brand hover:text-brand bg-white hover:bg-brand/5'}`}
              >
                {ind}
              </Link>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 text-sm text-gray-500 font-medium">
          Showing {companies.length} {companies.length === 1 ? 'company' : 'companies'}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companies.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-2xl border border-gray-200 text-center">
              <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No companies found</h3>
              <p className="text-gray-500">Try a different search term.</p>
            </div>
          ) : (
            companies.map((company) => (
              <CompanyRow key={company.id} company={company} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}
