'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Complaint {
  complaint_id: number;
  student_id: string;
  title: string;
  description: string;
  status: string;
  name: string;
  created_at: string;
}

export default function ManageComplaints() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get('/complaints');
        setComplaints(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleResolve = async (complaint_id: number) => {
    try {
      await api.put(`/complaints/resolve/${complaint_id}`, {});
      setComplaints(
        complaints.map((c) =>
          c.complaint_id === complaint_id ? { ...c, status: 'resolved' } : c
        )
      );
    } catch (err: any) {
      alert('Failed to resolve complaint');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">📢 Manage Complaints</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {complaints.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">No complaints found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div
                key={complaint.complaint_id}
                className={`bg-white p-6 rounded-lg shadow ${
                  complaint.status === 'resolved' ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{complaint.title}</h3>
                    <p className="text-gray-600 text-sm">
                      From: <strong>{complaint.name}</strong> ({complaint.student_id})
                    </p>
                    <p className="text-gray-700 mt-2">{complaint.description}</p>
                    <p className="text-gray-500 text-sm mt-2">
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="ml-4">
                    <span
                      className={`px-3 py-1 rounded text-white font-bold ${
                        complaint.status === 'resolved'
                          ? 'bg-green-600'
                          : 'bg-yellow-600'
                      }`}
                    >
                      {complaint.status.toUpperCase()}
                    </span>

                    {complaint.status === 'open' && (
                      <button
                        onClick={() => handleResolve(complaint.complaint_id)}
                        className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded transition"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}