'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push(data.user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div
          className="absolute top-16 right-16 w-18 h-18 bg-blue-200 rounded-full opacity-60 animate-pulse"
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className="absolute top-40 left-16 w-14 h-14 bg-indigo-300 rounded-full opacity-50 animate-pulse"
          style={{ animationDelay: '1.5s' }}
        ></div>
        <div
          className="absolute bottom-32 right-1/4 w-20 h-20 bg-purple-200 rounded-full opacity-40 animate-pulse"
          style={{ animationDelay: '3s' }}
        ></div>
        <div
          className="absolute bottom-16 left-1/3 w-16 h-16 bg-cyan-300 rounded-full opacity-70 animate-pulse"
          style={{ animationDelay: '0.8s' }}
        ></div>
        <div
          className="absolute top-1/3 right-1/2 transform translate-x-1/2 text-8xl opacity-5 animate-spin"
          style={{ animationDuration: '20s' }}
        >
          ☕
        </div>
      </div>

      <Navbar />
      <div className="relative z-10 flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 animate-slideUp">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-indigo-800 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-600">Sign in to your coffee account</p>
          </div>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-md hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 font-semibold"
            >
              Sign In ☕
            </button>
          </form>
          <div className="mt-6 space-y-3">
            <p className="text-center">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-indigo-600 hover:underline font-medium"
              >
                Register
              </Link>
            </p>
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
