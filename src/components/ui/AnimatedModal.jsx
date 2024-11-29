"use client";
import { motion, AnimatePresence } from "framer-motion";
import { IconX } from "@tabler/icons-react";

export const AnimatedModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden"
          >
            {/* Background blur and gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-white/50 rounded-2xl blur-xl" />
            
            {/* Modal content */}
            <div className="relative p-6 rounded-2xl border border-gray-200/20 bg-gradient-to-br from-gray-50 to-white backdrop-blur-xl shadow-xl">
              {/* Border effects */}
              <div className="absolute inset-0 border border-gray-200/20 rounded-2xl" />
              <div className="absolute inset-[-1px] bg-gradient-to-r from-transparent via-gray-200/10 to-transparent blur-sm" />
              
              {/* Content */}
              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <IconX className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                
                <p className="text-gray-600">{message}</p>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    className="px-4 py-2 rounded-lg bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200 transition-colors"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 