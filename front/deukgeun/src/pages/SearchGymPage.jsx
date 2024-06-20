import React, { useState } from 'react';
import { searchGyms } from '../api/searchApi';

function SearchGymPage() {
  const [keyword, setKeyword] = useState('');
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const results = await searchGyms(keyword);
      setGyms(results);
    } catch (err) {
      setError('Failed to search gyms.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Search Gyms</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSearch}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="keyword" className="sr-only">Keyword</label>
              <input
                id="keyword"
                name="keyword"
                type="text"
                autoComplete="keyword"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Search
            </button>
          </div>
        </form>
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="mt-6">
          {gyms.length > 0 ? (
            <ul className="space-y-4">
              {gyms.map((gym) => (
                <li key={gym.gymId} className="bg-white shadow overflow-hidden rounded-md px-6 py-4">
                  <h3 className="text-lg font-medium text-gray-900">{gym.gymName}</h3>
                  <p className="text-gray-500">{gym.address}</p>
                </li>
              ))}
            </ul>
          ) : (
            !loading && <p className="text-center text-gray-500">No gyms found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchGymPage;
