'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import Link from 'next/link';

interface DashboardData {
  student: any;
  application: any;
  score: any;
  allocation: any;
}

export default function StudentDashboard() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/student-login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await api.get('/students/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, router]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          👋 Welcome, {data?.student.name}!
        </h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Student ID</h3>
            <p className="text-2xl font-bold text-blue-600">{data?.student.student_id}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium mb-2">CGPA</h3>
            <p className="text-2xl font-bold text-green-600">{data?.student.cgpa}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Priority Score</h3>
            <p className="text-2xl font-bold text-purple-600">
              {data?.score?.priority_score || 'N/A'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Status</h3>
            <p className={`text-xl font-bold ${
              data?.allocation ? 'text-green-600' : 
              data?.application?.status === 'waiting' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {data?.allocation ? '✅ Allocated' : 
               data?.application?.status === 'waiting' ? '⏳ Waiting' :
               data?.application?.status ? '📋 Applied' : '❌ Not Applied'}
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Student Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">📝 Student Information</h2>
            <div className="space-y-3">
              <p><strong>Batch:</strong> {data?.student.batch}</p>
              <p><strong>Gender:</strong> {data?.student.gender}</p>
              <p><strong>Department:</strong> {data?.student.department}</p>
              <p><strong>Distance from Home:</strong> {data?.student.distance_from_home} km</p>
              <p><strong>Family Income:</strong> ৳{data?.student.family_income}</p>
              <p><strong>Special Condition:</strong> {data?.student.special_condition ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Previous Hostel Stay:</strong> {data?.student.previous_hostel_stay ? '✅ Yes' : '❌ No'}</p>
            </div>
          </div>

          {/* Allocation Info */}
          {data?.allocation ? (
            <div className="bg-green-50 p-6 rounded-lg shadow border-2 border-green-200">
              <h2 className="text-xl font-bold mb-4 text-green-600">🏠 Allocated Hostel</h2>
              <div className="space-y-3">
                <p><strong>Hostel:</strong> {data.allocation.hostel_name}</p>
                <p><strong>Location:</strong> {data.allocation.location}</p>
                <p><strong>Room:</strong> {data.allocation.room_number}</p>
                <p><strong>Seat:</strong> {data.allocation.seat_number}</p>
                <p><strong>Allocated At:</strong> {new Date(data.allocation.allocated_at).toLocaleDateString()}</p>
              </div>
            </div>
          ) : data?.application?.status === 'waiting' ? (
            <div className="bg-yellow-50 p-6 rounded-lg shadow border-2 border-yellow-200">
              <h2 className="text-xl font-bold mb-4 text-yellow-600">⏳ You're on Waiting List</h2>
              <p>Your application is pending. Please wait for the allocation process to complete.</p>
            </div>
          ) : (
            <div className="bg-blue-50 p-6 rounded-lg shadow border-2 border-blue-200">
              <h2 className="text-xl font-bold mb-4 text-blue-600">📋 Not Allocated Yet</h2>
              <Link
                href="/apply-hostel"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition"
              >
                Apply for Hostel
              </Link>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/result"
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg text-center transition transform hover:scale-105"
          >
            <h3 className="text-xl font-bold">📊 View Results</h3>
          </Link>

          <Link
            href="/complaints"
            className="bg-orange-600 hover:bg-orange-700 text-white p-6 rounded-lg text-center transition transform hover:scale-105"
          >
            <h3 className="text-xl font-bold">📢 Complaints</h3>
          </Link>

          <Link
            href="/apply-hostel"
            className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg text-center transition transform hover:scale-105"
          >
            <h3 className="text-xl font-bold">✍️ Apply Now</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}