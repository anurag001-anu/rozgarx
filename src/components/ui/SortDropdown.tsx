'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function SortDropdown({ initialSort }: { initialSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select 
        className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:border-brand font-medium text-gray-700"
        defaultValue={initialSort}
        onChange={handleSortChange}
      >
        <option value="relevance">Relevance</option>
        <option value="newest">Newest</option>
        <option value="closing_soon">Closing Soon</option>
        <option value="recently_updated">Recently Updated</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
}
