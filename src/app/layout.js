import { Metadata } from 'next';
import RootLayoutClient from './RootLayoutClient';

export const metadata = {
  title: 'SecondBrain - Your Digital Knowledge Hub',
  description: 'Transform your digital knowledge management with SecondBrain',
  icons: {
    icon: '/brain.svg',
  },
};

export default function RootLayout({
  children
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
