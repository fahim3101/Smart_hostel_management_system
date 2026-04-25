'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';

export default function ApplyHostel() {
  const { token, user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token || !user) {
      router.push('/student-login');
    }
  }, [token, user, router]);

  const handleApply = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Submitting application for student:', user?.id);
      
      const response = await api.post('/application/submit', {});
      
      console.log('Response:', response.data);
      setSuccess('✅ Application submitted successfully!');
      
      setTimeout(() => router.push('/student-dashboard'), 2000);
    } catch (err: any) {
      console.error('Error:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to apply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-blue-600">🏢 Apply for Hostel</h1>

          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h2 className="font-bold text-lg mb-3">ℹ️ How the allocation works?</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Your priority score is calculated automatically</li>
              <li>✓ Students are allocated based on priority ranking</li>
              <li>✓ If no seat is available, you'll be added to waiting list</li>
              <li>✓ You'll receive notification once allocated</li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <h2 className="font-bold text-lg mb-3">📊 Scoring Criteria</h2>
            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <p><strong>CGPA:</strong> 30%</p>
              <p><strong>Distance:</strong> 25%</p>
              <p><strong>Income:</strong> 20%</p>
              <p><strong>Special Condition:</strong> 15%</p>
              <p><strong>Previous Stay:</strong> 10%</p>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg mb-6 border-l-4 border-purple-500">
            <h2 className="font-bold text-lg mb-2">💡 Important Notes</h2>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• You can only apply once</li>
              <li>• Admin must run allocation after applications</li>
              <li>• Your priority score depends on your profile</li>
              <li>• Higher score = Better chance of allocation</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <button
            onClick={handleApply}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Submitting...
              </>
            ) : (
              <>
                <span>✓</span>
                Submit Application
              </>
            )}
          </button>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>📝 Next Steps:</strong> After submitting, wait for admin to run the allocation process. Then check "View Results" to see if you're allocated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}