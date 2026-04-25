'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🏢 Smart Hostel & Seat Allocation System
          </h1>
          <p className="text-xl text-gray-600">
            Fair, Transparent & Automated Hostel Distribution
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Features */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">⚡ Features</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Automated allocation</li>
              <li>✓ Priority-based scoring</li>
              <li>✓ Transparent process</li>
              <li>✓ Real-time tracking</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-green-600">👥 Roles</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Student - Apply & Track</li>
              <li>Admin - Manage System</li>
              <li>Authority - View Reports</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">🔒 Security</h2>
            <ul className="space-y-2 text-gray-700">
              <li>JWT Authentication</li>
              <li>Role-based Access</li>
              <li>Secure Database</li>
            </ul>
          </div>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-3 gap-8">
          <Link
            href="/student-login"
            className="bg-blue-600 hover:bg-blue-700 text-white p-8 rounded-lg text-center transition transform hover:scale-105"
          >
            <h3 className="text-2xl font-bold mb-2">👨‍🎓 Student</h3>
            <p className="mb-4">Login as a student</p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded font-bold">
              Login
            </button>
          </Link>

          <Link
            href="/admin-login"
            className="bg-green-600 hover:bg-green-700 text-white p-8 rounded-lg text-center transition transform hover:scale-105"
          >
            <h3 className="text-2xl font-bold mb-2">👨‍💼 Admin</h3>
            <p className="mb-4">Manage the system</p>
            <button className="bg-white text-green-600 px-6 py-2 rounded font-bold">
              Login
            </button>
          </Link>

          <Link
            href="/authority-login"
            className="bg-purple-600 hover:bg-purple-700 text-white p-8 rounded-lg text-center transition transform hover:scale-105"
          >
            <h3 className="text-2xl font-bold mb-2">📋 Authority</h3>
            <p className="mb-4">View reports</p>
            <button className="bg-white text-purple-600 px-6 py-2 rounded font-bold">
              Login
            </button>
          </Link>
        </div>

        {/* Test Credentials */}
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mt-16">
          <h3 className="font-bold text-lg mb-3">📝 Test Credentials:</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Student:</strong>
              <p>ID: STU202400001</p>
              <p>Pass: password123</p>
            </div>
            <div>
              <strong>Admin:</strong>
              <p>User: admin</p>
              <p>Pass: password123</p>
            </div>
            <div>
              <strong>Authority:</strong>
              <p>User: authority</p>
              <p>Pass: password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}