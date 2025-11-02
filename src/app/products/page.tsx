
import ProductsClient from './ProductsClient';
import { Suspense } from 'react';

export default function ProductsPage({ searchParams }: { searchParams?: { q?: string }}) {
  const initialSearch = searchParams?.q || '';

  return (
    <Suspense fallback={<div className="container mx-auto py-12 px-4">Loading...</div>}>
      {/* Pass the initial search param into the client component */}
      {/* ProductsClient is a client component that handles search params and UI */}
      {/* This avoids using `useSearchParams()` during prerender on the server */}
      <ProductsClient initialSearch={initialSearch} />
    </Suspense>
  );
}
