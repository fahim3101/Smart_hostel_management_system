'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function GenerateStudents() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    if (!confirm('⚠️ This will generate 100 students. Continue?')) return;

    setLoading(true);
    setError('');
    setSuccess('');
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const response = await api.post('/generate/students', {});

      clearInterval(progressInterval);
      setProgress(100);

      setSuccess(`✅ ${response.data.message}`);
      setTimeout(() => {
        router.push('/admin-dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate students');
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-blue-600">👥 Generate Students</h1>

          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h2 className="font-bold text-lg mb-3">📊 Generation Details</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Total Students: <strong>100</strong> (25 per batch)</li>
              <li>• Batches: <strong>4</strong> (Batch 1 to 4)</li>
              <li>• Realistic Bangladeshi names</li>
              <li>• Random CGPA (2.50 - 4.00)</li>
              <li>• Random distance (10 - 500 km)</li>
              <li>• Random family income (5000 - 100000)</li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <h2 className="font-bold text-lg mb-3">✅ What will be generated</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Student profiles with unique IDs</li>
              <li>✓ Contact information</li>
              <li>✓ Academic and socioeconomic data</li>
              <li>✓ All data stored in database</li>
            </ul>
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

          {loading && progress > 0 && (
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold">Progress:</span>
                <span className="text-sm font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold text-lg transition"
          >
            {loading ? `⏳ Generating... ${progress}%` : '👥 Generate 100 Students'}
          </button>
        </div>
      </div>
    </div>
  );
}