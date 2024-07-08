// File: pages/index.js
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while searching. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>AI Grant Search Engine</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">AI Grant Search Engine</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your organization's mission or grant requirements"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <button 
            type="submit" 
            className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Search Results</h2>
            <ul className="space-y-4">
              {results.map((result, index) => (
                <li key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-blue-700">{result.title}</h3>
                  <p className="mt-2 text-gray-600">{result.description}</p>
                  <a href={result.link} className="mt-2 inline-block text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    Learn More
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

