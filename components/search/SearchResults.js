'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/product/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        
        const data = await response.json();
        setResults(data.products || []);
      } catch (err) {
        console.error('Search error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query]);

  if (!query) return <p className="text-gray-600">Enter a search term to find products</p>;
  if (loading) return <div className="text-center py-8">Searching...</div>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (results.length === 0) return <p className="text-gray-600">No results found for {query}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((product) => (
        <Link href={`/product/${product._id}`} key={product._id}>
          <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
            <div className="h-48 bg-gray-100 flex items-center justify-center relative">
              {product.images && product.images[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.title}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.target.src = "/placeholder-product.jpg";
                    e.target.onerror = null;
                  }}
                />
              ) : (
                <div className="text-gray-400">No Image</div>
              )}
            </div>
            <div className="p-4 flex-grow flex flex-col">
              <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
              <p className="text-gray-600 mb-2 line-clamp-2">{product.category}</p>
              <p className="font-bold text-purple-600 mt-auto">₹{product.price.toLocaleString()}</p>
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
 