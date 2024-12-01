'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconBrain, IconSettings, IconShield, IconArrowRight, IconNetwork, IconMessageCircle, IconDownload, IconBookmark, IconFolders,IconLogin, IconFiles, IconFilter, IconBrandGithub, IconBrandTwitter } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import auth from '../firebase/firebase.js';
import Link from 'next/link';

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

const GuideSection = () => {
  const [activeGuide, setActiveGuide] = useState('extension');

  const handleDownload = () => {
    // Create a link to your zip file
    const link = document.createElement('a');
    link.href = '/extension.zip'; // Make sure to place your zip file in the public folder
    link.download = 'secondbrain-extension.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const guides = {
    extension: [
      {
        title: "Install the Extension",
        description: (
          <div>
            <p className="mb-4">Add SecondBrain to your browser from the Chrome Web Store to start saving your digital knowledge.</p>
            <div className="p-4 bg-gray-100 rounded-xl text-sm group-hover:bg-gray-800">
              <p className="text-gray-600 group-hover:text-gray-300 mb-2 text-xs">
                <strong>Note:</strong> Currently not available on Chrome Web Store.
              </p>
              <p className="text-gray-600 group-hover:text-gray-300">
                Click{' '}
                <IconDownload 
                  className="inline mx-1 cursor-pointer hover:scale-110 transition-transform" 
                  size={16} 
                  onClick={handleDownload}
                />{' '}
                to download the extension and manually add it to your browser&apos;s extensions.
              </p>
            </div>
          </div>
        ),
        icon: <IconDownload size={32} />
      },
      {
        title: "Save While Browsing",
        description: "Click the SecondBrain icon at bottom right to save important information as you browse.",
        icon: <IconBookmark size={32} />
      },
      {
        title: "Organize Automatically",
        description: "Your saved content is connected to related information in your knowledge base.",
        icon: <IconFolders size={32} />
      }
    ],
    website: [
      {
        title: "Chat with Your Knowledge",
        description: "Use the AI Assistant to ask questions about your stored information. Get contextual answers and explore your knowledge through natural conversation.",
        icon: <IconMessageCircle size={32} />
      },
      {
        title: "Quick Filter & Search",
        description: "Instantly find what you need with our powerful filter system. Search by tags, dates, or keywords to quickly access specific pieces of information from your knowledge base.",
        icon: <IconFilter size={32} />
      },
      {
        title: "Manage Your Notes",
        description: "Access all your saved content in one place. View, edit, and organize your notes with our intuitive interface. Use tags and categories to keep everything structured.",
        icon: <IconFiles size={32} />
      }
    ]
  };

  return (
    <div id="guide" className="bg-white py-20">
      <div className="container mx-auto px-8">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-8">
            How to Use SecondBrain
          </h2>
          
          <div className="flex p-1 gap-1 bg-gray-100 rounded-full relative">
            {/* Background Slider */}
            <motion.div
              className="absolute h-full rounded-full bg-black"
              initial={false}
              animate={{
                x: activeGuide === 'extension' ? 0 : '100%',
                width: '50%'
              }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
            
            {/* Buttons */}
            <motion.button
              onClick={() => setActiveGuide('extension')}
              className={`px-6 py-2 rounded-full text-sm font-medium relative z-10 transition-colors duration-300 ${
                activeGuide === 'extension' 
                  ? 'text-white' 
                  : 'text-gray-600 hover:text-black'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Extension Guide
            </motion.button>
            <motion.button
              onClick={() => setActiveGuide('website')}
              className={`px-6 py-2 rounded-full text-sm font-medium relative z-10 transition-colors duration-300 ${
                activeGuide === 'website' 
                  ? 'text-white' 
                  : 'text-gray-600 hover:text-black'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Website Guide
            </motion.button>
          </div>
        </div>

        <motion.div
          key={activeGuide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guides[activeGuide].map((guide, index) => (
              <motion.div 
                key={guide.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="p-6 rounded-3xl border border-black group hover:bg-[#1F2937] transition-colors duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-black group-hover:text-white transition-colors duration-300">
                    {guide.icon}
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-gray-400">/ 0{index + 1}</div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-black group-hover:text-white transition-colors duration-300">
                  {guide.title}
                </h3>
                <div className="text-gray-600 group-hover:text-gray-300 transition-colors duration-300">
                  {guide.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Footer = () => {
  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Guide', href: '#guide' },
    { name: 'Contact us', href: '#contact' },
  ];

  return (
    <footer id="contact" className="bg-white py-20">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <IconBrain size={32} className="text-black" />
              <span className="text-xl font-semibold text-black">SecondBrain</span>
            </div>
            <p className="text-gray-600 mb-6">
              Your personal knowledge assistant that helps you store, organize, and retrieve information efficiently.
            </p>
            <div className="flex gap-4">
              <motion.a
                href="https://github.com/abhayishere/secondbrainweb"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
              >
                <IconBrandGithub size={20} />
              </motion.a>
              <motion.a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
              >
                <IconBrandTwitter size={20} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-black mb-4">Quick Links</h3>
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-black mb-4">Contact</h3>
            <div className="flex flex-col gap-3">
              <a 
                href="mailto:abhyadav1@gmail.com" 
                className="text-gray-600 hover:text-black transition-colors"
              >
                abhyadav1@gmail.com
              </a>
              <p className="text-gray-600">
                123 AI Street<br />
                San Francisco, CA 94105
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-20 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} SecondBrain. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-600 hover:text-black text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-black text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LandingPage = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const { user, login } = useAuth();
  const router = useRouter();

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Guide", href: "#guide" },
    { name: "Contact", href: "mailto:abhyadav1@gmail.com" }
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
    <div className="fixed inset-0 bg-[#18181B] overflow-auto">
      <div className="min-h-screen p-6">
        <div className="relative w-full min-h-[calc(100vh-48px)] bg-white rounded-[2.5rem] overflow-hidden">
          <div className="absolute inset-0 bg-white">
            <div className="relative h-full overflow-y-auto">
              {/* Navigation */}
              <nav className="sticky top-0 z-50 flex justify-between items-center px-12 py-6 bg-white">
                <div className="flex items-center gap-2">
                  <IconBrain size={32} className="text-black" />
                  <span className="text-xl font-semibold text-black">SecondBrain</span>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={(e) => {
                          if (item.href.startsWith('#')) {
                            e.preventDefault();
                            document.querySelector(item.href)?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start'
                            });
                          }
                        }}
                        className="px-4 py-2 text-gray-600 hover:bg-black hover:text-white rounded-full transition-all duration-300 ease-in-out"
                      >
                        {item.name}
                      </Link>
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

                {/* Guide Section */}
                <GuideSection />
                
                {/* Footer */}
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
