"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { IconTrash } from '@tabler/icons-react';
import { useAuth } from '../app/context/AuthContext';
import { AnimatedModal } from './ui/AnimatedModal';

const NodesView = () => {
  const [nodes, setNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, nodeId: null });
  const { user } = useAuth();

  const fetchNodes = useCallback(async () => {
    try {
      const response = await fetch('https://secondbrainbe.onrender.com/get-links', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      const data = await response.json();
      const nodesWithIds = data.map(node => ({
        ...node,
        _id: node._id || node.id || Math.random().toString(36).substr(2, 9)
      }));
      setNodes(nodesWithIds);
    } catch (error) {
      console.error('Error fetching nodes:', error);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);

  const handleDelete = async () => {
    if (!deleteModal.nodeId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('https://secondbrainbe.onrender.com/delete-link', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ id: deleteModal.nodeId })
      });

      if (response.ok) {
        setNodes(nodes.filter(node => node._id !== deleteModal.nodeId));
      } else {
        console.error('Failed to delete node');
      }
    } catch (error) {
      console.error('Error deleting node:', error);
    } finally {
      setIsLoading(false);
      setDeleteModal({ isOpen: false, nodeId: null });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {nodes.map((node) => {
          const nodeKey = node._id || node.id || `node-${Math.random()}`;
          
          return (
            <motion.div
              key={nodeKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-white/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative p-6 rounded-2xl border border-gray-200/20 bg-gradient-to-br from-gray-50 to-white backdrop-blur-xl shadow-xl overflow-hidden min-h-[200px]">
                <div className="absolute inset-0 border border-gray-200/20 rounded-2xl" />
                <div className="absolute inset-[-1px] bg-gradient-to-r from-transparent via-gray-200/10 to-transparent blur-sm" />
                
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {node.title || 'Untitled Node'}
                </h3>
                <p className="text-gray-600 mb-12">
                  {node.description || node.content || 'No description available'}
                </p>

                <motion.button
                  onClick={() => setDeleteModal({ isOpen: true, nodeId: node._id })}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white hover:bg-red-50 border border-gray-200 shadow-lg group/delete"
                >
                  <IconTrash 
                    size={20} 
                    className="text-gray-400 group-hover/delete:text-red-500 transition-colors"
                  />
                </motion.button>
              </div>
            </motion.div>
          );
        })}

        {nodes.length === 0 && (
          <div key="empty-state" className="col-span-full text-center text-gray-600 py-12">
            <p>No nodes found. Start by creating one!</p>
          </div>
        )}
      </div>

      <AnimatedModal
        key="delete-modal"
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, nodeId: null })}
        onConfirm={handleDelete}
        title="Delete Node"
        message="Are you sure you want to delete this node? This action cannot be undone."
      />
    </>
  );
};

export default NodesView;