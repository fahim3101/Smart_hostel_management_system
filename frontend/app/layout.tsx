import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Layout/Header';

export const metadata: Metadata = {
  title: 'Smart Hostel & Seat Allocation System',
  description: 'Automated hostel allocation system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}