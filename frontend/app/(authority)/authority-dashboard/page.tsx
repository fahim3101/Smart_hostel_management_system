'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';

interface Stats {
  totalStudents: number;
  totalApplications: number;
  allocatedStudents: number;
  waitingList: number;
  availableSeats: number;
  openComplaints: number;
}

export default function AuthorityDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/authority-login');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await api.get('/allocation/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token, router]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">📋 Authority Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Students</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalStudents}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Applications</h3>
            <p className="text-3xl font-bold text-green-600">{stats?.totalApplications}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Allocated</h3>
            <p className="text-3xl font-bold text-purple-600">{stats?.allocatedStudents}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Waiting List</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats?.waitingList}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Available Seats</h3>
            <p className="text-3xl font-bold text-indigo-600">{stats?.availableSeats}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Open Complaints</h3>
            <p className="text-3xl font-bold text-red-600">{stats?.openComplaints}</p>
          </div>
        </div>
      </div>
    </div>
  );
}