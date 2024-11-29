"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { IconSearch, IconChevronDown, IconBrain, IconFilter, IconInfoCircle } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '../app/context/AuthContext';
import { useRouter } from 'next/navigation';

const AssistantSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [allNodes, setAllNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const [selectedMode, setSelectedMode] = useState({
    id: 'ai',
    name: 'Neural Search',
    icon: IconBrain,
    description: 'AI-powered semantic search'
  });

  const handleAuthError = async () => {
    alert('Session expired. Please login again.');
    await logout();
    router.push('/');
  };

  // Define fetchNodes with useCallback before using it in useEffect
  const fetchNodes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://secondbrainbe.onrender.com/get-links', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      if (response.status === 401) {
        handleAuthError();
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch nodes');
      }
      
      const data = await response.json();
      setAllNodes(data);
    } catch (error) {
      console.error('Error fetching nodes:', error);
      if (error.message.includes('401')) {
        handleAuthError();
      } else {
        alert('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.token, handleAuthError]);

  // Use fetchNodes in useEffect after it's been defined
  useEffect(() => {
    if (user?.token) {
      fetchNodes();
    } else {
      handleAuthError();
    }
  }, [user, fetchNodes, handleAuthError]);

  // Filter nodes based on search query
  useEffect(() => {
    if (selectedMode.id === 'manual' && searchQuery.length >= 3) {
      const filtered = allNodes.filter(node => 
        node.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNodes(filtered);
    } else {
      setFilteredNodes([]);
    }
  }, [searchQuery, selectedMode.id, allNodes]);

  // Fix for unescaped quotes in JSX
  const noResultsMessage = (query) => (
    <div className="text-center text-gray-500 py-8">
      No results found for &ldquo;{query}&rdquo;
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="w-full max-w-2xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black mb-2">
            SecondBrain
          </h1>
          <p className="text-gray-600">
            Ask anything about your stored knowledge
          </p>
        </div>
        
        <div className="relative">
          {/* Search Form */}
          <div className="flex gap-2">
            {/* Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 h-[52px] rounded-xl border border-neutral-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <selectedMode.icon className="w-5 h-5" />
                <span>{selectedMode.name}</span>
                <IconChevronDown 
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 mt-2 w-56 rounded-xl bg-white border border-neutral-200 shadow-lg"
                  >
                    {searchModes.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setSelectedMode(mode);
                          setIsDropdownOpen(false);
                        }}
                        className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors
                          ${mode.id === selectedMode.id ? 'bg-gray-50' : ''}
                          ${mode.id === searchModes[0].id ? 'rounded-t-xl' : ''}
                          ${mode.id === searchModes[searchModes.length - 1].id ? 'rounded-b-xl' : ''}
                        `}
                      >
                        <mode.icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-700">{mode.name}</div>
                          <div className="text-xs text-gray-500">{mode.description}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Input with Warning Message Container */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[52px] px-4 pl-12 pr-4 text-base rounded-xl border border-neutral-200 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={selectedMode.id === 'ai' ? 
                  "Ask anything about your notes..." : 
                  "Search by keywords..."
                }
              />
              <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              
              {/* Warning Message - Repositioned */}
              <AnimatePresence>
                {selectedMode.id === 'manual' && searchQuery.length > 0 && searchQuery.length < 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 top-full mt-2 flex items-center gap-2 text-sm text-gray-500"
                  >
                    <IconInfoCircle className="w-4 h-4" />
                    <span>Please type at least 3 characters to see results</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="mt-12"> {/* Increased margin to accommodate warning */}
          <AnimatePresence>
            {selectedMode.id === 'manual' && searchQuery.length >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-4"
              >
                <div className="text-sm text-gray-500 mb-4">
                  Found {filteredNodes.length} results
                </div>
                
                {filteredNodes.map((node) => (
                  <motion.div
                    key={node._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      {node.title || 'Untitled Node'}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {node.description || node.content || 'No description available'}
                    </p>
                  </motion.div>
                ))}
                {filteredNodes.length === 0 && searchQuery.length >= 3 && (
                  noResultsMessage(searchQuery)
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AssistantSearch;