'use client';
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayoutClient({ children }) {
  return (
    <html lang="en" className="light">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
} 