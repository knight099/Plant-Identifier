'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => Promise<void>;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (query.trim() && !isLoading) {
      setIsLoading(true);
      await onSearch(query);
      setIsLoading(false);
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await handleSearch();
    }
  };

  return (
    <div className="flex gap-3 items-center bg-black rounded-full shadow-md px-4 py-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search by name, characteristics, or location..."
        className="flex-1 outline-none text-black-700"
      />
      <button
        onClick={handleSearch}
        disabled={isLoading}
        className={`px-4 py-2 text-white rounded-full ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
}
