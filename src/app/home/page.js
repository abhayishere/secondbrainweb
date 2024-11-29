"use client"
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Sidebar, SidebarBody, SidebarLink } from '../../components/ui/sidebar';
import './Homepage.css';
import Link from "next/link";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconNote,
  IconBrain
} from "@tabler/icons-react"
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import AssistantSearch from '../../components/AssistantSearch';
import NodesView from '../../components/NodesView';

const SidebarDemo = () => {
  const [selectedView, setSelectedView] = useState('assistant');
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('firebaseToken');
    if (!token || !user) {
      router.push('/');
    }
  }, [user, router]);

  const handleLogout = async (e) => {
    console.log("handleLogout called");
    if (e) {
      e.preventDefault();
    }
    try {
      console.log("Attempting to logout");
      await logout();
      console.log("Logout successful");
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const links = [
    {
      label: "Assistant",
      href: '#',
      icon: (
        <IconBrandTabler className="text-black h-5 w-5 flex-shrink-0" />
      ),
      onClick: (e) => {
        console.log("Assistant clicked");
        setSelectedView('assistant');
      }
    },
    {
      label: "Nodes",
      href: '#',
      icon: (
        <IconNote className="text-black h-5 w-5 flex-shrink-0" />
      ),
      onClick: (e) => {
        console.log("Nodes clicked");
        setSelectedView('nodes');
      }
    },
    {
      label: "Logout",
      href: '#',
      icon: (
        <IconArrowLeft className="text-black h-5 w-5 flex-shrink-0" />
      ),
      onClick: (e) => {
        console.log("Logout clicked");
        e.preventDefault();
        handleLogout(e);
      }
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-white w-full flex-1 border border-neutral-200 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden" href="/">
            <Logo /> 
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user ? user.name : 'User',
                href: "#",
                icon: (
                  <IconBrain className="h-7 w-7 flex-shrink-0 rounded-full" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard selectedView={selectedView} />
    </div>
  );
}

const Logo = () => {
  const router = useRouter();

  return (
    <Link
      href="#"
      onClick={() => {
        router.push('/');
      }}
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <IconBrain className="h-7 w-7 flex-shrink-0 rounded-full" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        SecondBrain
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// Dummy dashboard component with content
const Dashboard = ({ selectedView }) => {
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 bg-white flex flex-col gap-2 flex-1 w-full h-full">
        {selectedView === 'assistant' && (
          <div className="text-black">
            <AssistantSearch />
          </div>
        )}
        {selectedView === 'nodes' && (
          <div className="text-black">
            <NodesView />
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarDemo;