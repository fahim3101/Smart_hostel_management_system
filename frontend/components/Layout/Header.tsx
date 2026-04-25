'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          🏢 Smart Hostel System
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">
                Welcome, <strong>{user.name || user.username}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/" className="hover:text-blue-200 transition">
              Home
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}