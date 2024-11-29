"use client"
import React, { useState, useEffect } from 'react';

const NodesView = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const token = localStorage.getItem('firebaseToken');
      const response = await fetch('https://secondbrainbe.onrender.com/get-links', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setLinks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching links:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-800 dark:border-neutral-200"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <h2 className="text-2xl font-bold mb-6 text-black">Your Nodes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-neutral-200 bg-white hover:shadow-lg transition-shadow"
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {link.title || link.url}
            </a>
            {link.description && (
              <p className="mt-2 text-sm text-gray-600">
                {link.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodesView;