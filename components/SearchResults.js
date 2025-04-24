'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      // In a real app, you would fetch from your API here
      const timer = setTimeout(() => {
        const mockResults = generateMockResults(query);
        setResults(mockResults);
        setLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!query) return <p>Enter a search term to find products</p>;
  if (loading) return <div className="text-center py-8">Searching...</div>;
  if (results.length === 0) return <p>No results found for {query}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((product) => (
        <Link href={`/products/${product.id}`} key={product.id}>
          <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <div className="text-gray-400">Product Image</div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
              <p className="font-bold text-purple-600">${product.price.toFixed(2)}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function generateMockResults(query) {
  const mockProducts = [
    {
      id: '1',
      name: 'Wireless Headphones',
      price: 99.99,
      description: 'Premium wireless headphones with noise cancellation'
    },
    {
      id: '2',
      name: 'Smart Watch',
      price: 199.99,
      description: 'Latest smart watch with fitness tracking'
    },
    {
      id: '3',
      name: 'Running Shoes',
      price: 79.99,
      description: 'Comfortable running shoes for all terrains'
    },
    {
      id: '4',
      name: 'Bluetooth Speaker',
      price: 59.99,
      description: 'Portable speaker with 20h battery life'
    },
  ];

  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) || 
    product.description.toLowerCase().includes(query.toLowerCase())
  );
}