'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';

export default function Result() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !user) {
      router.push('/student-login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await api.get(`/allocation/result/${user.id}`);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch results', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user, router]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">📊 Allocation Results</h1>

        {data?.allocation ? (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-green-600 mb-2">✅ Congratulations!</h2>
              <p className="text-gray-600">You have been allocated a seat</p>
            </div>

            <div className="space-y-4 bg-green-50 p-6 rounded-lg">
              <div className="flex justify-between items-center border-b pb-3">
                <span className="font-bold">Hostel Name:</span>
                <span>{data.allocation.hostel_name}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-3">
                <span className="font-bold">Location:</span>
                <span>{data.allocation.location}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-3">
                <span className="font-bold">Room Number:</span>
                <span className="bg-blue-100 px-3 py-1 rounded font-bold">{data.allocation.room_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold">Seat Number:</span>
                <span className="bg-green-100 px-3 py-1 rounded font-bold">{data.allocation.seat_number}</span>
              </div>
            </div>
          </div>
        ) : data?.waiting ? (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-yellow-600 mb-2">⏳ You're on Waiting List</h2>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <p className="text-gray-700 mb-4">
                Your priority score: <strong>{data.waiting.priority_score}</strong>
              </p>
              <p className="text-gray-600">
                Thank you for your patience. Seats will be allocated soon.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-600 mb-2">No Result Yet</h2>
              <p className="text-gray-600">
                Please apply first to see your allocation results
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}