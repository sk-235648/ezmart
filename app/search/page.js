import { Suspense } from 'react';
import SearchResults from '@/components/SearchResults';

export default function SearchPage({ searchParams }) {
  const query = searchParams?.q || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Results for "${query}"` : 'Search our store'}
      </h1>
      
      <Suspense fallback={<div>Loading results...</div>}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}