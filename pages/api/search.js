import { useState } from 'react';
import Head from 'next/head';
import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      if (response.ok) {
        setResults(data.results);
      } else {
        throw new Error(data.error || data.details || 'An unknown error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`An error occurred while searching: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Head>
        <title>AI Grants Search Engine</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">AI Grants Search Engine</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for grants..."
              className="flex-grow p-4 border border-gray-300 rounded-l-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit" 
              className="px-6 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <SparklesIcon className="animate-pulse h-6 w-6" />
              ) : (
                <><MagnifyingGlassIcon className="h-6 w-6 mr-2" /> Search</>
              )}
            </button>
          </div>
        </form>

        {loading && <p className="text-center text-gray-600">Searching for grants...</p>}
        
        {!loading && results.length === 0 && <p className="text-center text-gray-600">No results found. Try another search.</p>}

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
