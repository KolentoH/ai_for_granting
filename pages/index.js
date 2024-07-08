import { useState } from 'react';
import Head from 'next/head';
import { MagnifyingGlassIcon as SearchIcon, PaperClipIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

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
    <div className="min-h-screen bg-white">
      <Head>
        <title>Grants Search Engine</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Grants Search Engine</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything..."
              className="w-full p-4 pr-20 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <ArrowRightIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <SearchIcon className="h-4 w-4 mr-1" />
            <span className="mr-4">Focus</span>
            <PaperClipIcon className="h-4 w-4 mr-1" />
            <span>Attach</span>
          </div>
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

