'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconBrain, IconSettings, IconShield, IconArrowRight, IconNetwork } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import auth from '../firebase/firebase.js';

const provider = new GoogleAuthProvider();

const FeatureTile = ({ number, title, description, icon }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-6 rounded-3xl border border-black group hover:bg-[#1F2937] transition-colors duration-300"
  >
    <div className="relative z-10">
      <div className="text-sm text-gray-600 group-hover:text-gray-400 transition-colors duration-300">/ {number}</div>
      {icon && (
        <div className="mb-4">
          {React.cloneElement(icon, {
            className: "text-black group-hover:text-white transition-colors duration-300"
          })}
        </div>
      )}
      <h3 className="text-2xl font-semibold mb-4 text-black group-hover:text-white transition-colors duration-300">{title}</h3>
      <p className="text-gray-600 group-hover:text-gray-300 transition-colors duration-300 mb-4">{description}</p>
      <motion.button
        whileHover={{ x: 5 }}
        className="flex items-center gap-2 text-gray-600 group-hover:text-white transition-colors duration-300"
      >
        Learn more
        <IconArrowRight size={16} />
      </motion.button>
    </div>
  </motion.div>
);

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

  const features = [
    {
      number: "01",
      title: "AI-Powered Chat",
      description: "Engage with your knowledge through natural conversations. Ask questions and get instant, contextual responses from your stored information.",
      icon: <IconBrain size={48} />
    },
    {
      number: "02",
      title: "Knowledge Graph",
      description: "Visualize and navigate your information through an interactive network of connected ideas and concepts.",
      icon: <IconNetwork size={48} />
    },
    {
      number: "03",
      title: "Secure Storage",
      description: "Your data is encrypted and securely stored, ensuring your personal knowledge remains private and protected.",
      icon: <IconShield size={48} />
    }
  ];

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#18181B] p-6">
      <div className="relative w-full min-h-[calc(100vh-48px)] bg-white rounded-[2.5rem] overflow-hidden">
        <div className="absolute inset-0 bg-white">
          <div className="relative h-full overflow-y-auto">
            {/* Navigation - Reduced padding */}
            <nav className="sticky top-0 z-50 flex justify-between items-center px-12 py-6 bg-white">
              <div className="flex items-center gap-2">
                <IconBrain size={32} className="text-black" />
                <span className="text-xl font-semibold text-black">SecondBrain</span>
              </div>
              
              <div className="flex items-center gap-8">
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
                        onClick={(e) => {
                          if (item.href === '#features') {
                            e.preventDefault();
                            document.getElementById('features').scrollIntoView({ 
                              behavior: 'smooth',
                              block: 'start'
                            });
                          }
                        }}
                      >
                        {item.name}
                      </a>
                      <AnimatePresence>
                        {hoveredItem === item.name && (
                          <motion.div
                            className="absolute inset-0 bg-black rounded-full -z-10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{
                              layout: { type: "spring", bounce: 0.2 }
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
                  className="px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  Login with Google
                  <IconBrain size={20} />
                </motion.button>
              </div>
            </nav>

            {/* Content Container */}
            <div className="relative">
              {/* Hero Section - Equal spacing top and bottom */}
              <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center bg-white">
                <div className="container mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pl-12 py-20">
                    <div className="flex flex-col justify-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-black max-w-2xl"
                      >
                        <h1 className="text-7xl font-bold leading-tight mb-8">
                          There is a
                          <br />
                          <span className="flex items-center gap-4">
                            <IconBrain className="w-12 h-12" />
                            Better Way
                          </span>
                          to Remember.
                        </h1>
                        
                        <p className="text-gray-600 text-lg mb-10 max-w-lg">
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
                    </div>

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
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div id="features" className="bg-white py-20">
                <div className="container mx-auto px-8">
                  <div className="mb-16">
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-4xl md:text-5xl font-bold text-black text-center"
                    >
                      How can SecondBrain help?
                    </motion.h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                      <FeatureTile
                        key={feature.number}
                        {...feature}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
