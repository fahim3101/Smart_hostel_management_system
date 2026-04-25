'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function RunAllocation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRunAllocation = async () => {
    if (!confirm('⚠️ This will run the allocation process. Continue?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/allocation/run-allocation', {});
      setSuccess('✅ Allocation completed successfully!');
      setTimeout(() => router.push('/admin-dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to run allocation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-green-600">🚀 Run Allocation</h1>

          <div className="bg-yellow-50 p-6 rounded-lg mb-6 border-2 border-yellow-200">
            <h2 className="font-bold text-lg mb-3">⚠️ Important</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• This process cannot be reversed</li>
              <li>• All pending applications will be processed</li>
              <li>• Students will be ranked by their priority scores</li>
              <li>• Make sure all students have applied</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h2 className="font-bold text-lg mb-3">📋 Process Steps</h2>
            <ol className="space-y-2 text-gray-700">
              <li>1. Calculate priority scores for all applicants</li>
              <li>2. Rank students by priority</li>
              <li>3. Assign available seats in order</li>
              <li>4. Add remaining students to waiting list</li>
            </ol>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <button
            onClick={handleRunAllocation}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold text-lg transition"
          >
            {loading ? '⏳ Processing...' : '🚀 Start Allocation'}
          </button>
        </div>
      </div>
    </div>
  );
}