import React, { useState } from 'react';
import { IconSearch } from "@tabler/icons-react";

const AssistantSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="w-full max-w-2xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black mb-2">
            SecondBrain Assistant
          </h1>
          <p className="text-gray-600">
            Ask anything about your stored knowledge
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-4 pl-12 pr-12 text-lg rounded-full border border-neutral-200 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search your second brain..."
            />
            <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssistantSearch;