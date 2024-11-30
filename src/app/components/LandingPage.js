'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconBrain } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import auth from '../firebase/firebase.js';

const provider = new GoogleAuthProvider();

const LandingPage = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const { user, login } = useAuth();
  const router = useRouter();

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Contact us', href: '#contact' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('firebaseToken');
    const userName = localStorage.getItem('userName');
    if (token && userName && user) {
      const idToken = localStorage.getItem('token')
      console.log('Sending message to extension', token);
      window.postMessage({ action: "storeToken", message: token }, "*");
      router.push('/home');
    }
  }, [user, router]);

  const handleSignInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        const idToken = await user.getIdToken();
        login({ name: user.displayName, token: idToken });
        localStorage.setItem('token', idToken);
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#18181B] p-6">
      <div className="relative w-full h-[calc(100vh-48px)] bg-[#18181B] rounded-[2.5rem] overflow-hidden">
        <div className="absolute inset-[1px] rounded-[2.5rem] bg-white">
          <nav className="flex justify-between items-center px-8 py-6">
            <div className="flex items-center gap-2">
              <IconBrain size={32} className="text-black" />
              <span className="text-xl font-semibold text-black">SecondBrain</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-8">
                {navItems.map((item) => (
                  <motion.div
                    key={item.name}
                    className="relative"
                    onHoverStart={() => setHoveredItem(item.name)}
                    onHoverEnd={() => setHoveredItem(null)}
                  >
                    <a
                      href={item.href}
                      className={`text-gray-600 transition-all duration-200 px-6 py-3 rounded-full relative z-10 inline-block ${
                        hoveredItem === item.name ? 'text-white' : 'hover:text-white'
                      }`}
                    >
                      {item.name}
                    </a>
                    <AnimatePresence>
                      {hoveredItem === item.name && (
                        <motion.div
                          layoutId="navbarHover"
                          className="absolute inset-0 bg-black rounded-full -z-0"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            transition: { duration: 0.2 }
                          }}
                          exit={{ 
                            opacity: 0, 
                            scale: 0.9,
                            transition: { duration: 0.15 }
                          }}
                          transition={{
                            layout: {
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6
                            }
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignInWithGoogle}
                className="px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition-all duration-200 flex items-center gap-2"
              >
                Login with Google
              </motion.button>
            </div>
          </nav>

          <main className="container mx-auto px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-black"
              >
                <h1 className="text-6xl font-bold leading-tight mb-6">
                  There is a
                  <br />
                  <span className="flex items-center gap-4">
                    <IconBrain className="w-12 h-12" />
                    Better Way
                  </span>
                  to Remember.
                </h1>
                
                <p className="text-gray-600 text-lg mb-8 max-w-lg">
                  SecondBrain is your personal knowledge assistant that helps you store, organize, and retrieve information efficiently.
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignInWithGoogle}
                  className="px-8 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                >
                  Get Started
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative w-full h-[400px] rounded-2xl overflow-hidden"
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain rounded-2xl"
                >
                  <source src="/brainfinal_animation.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
