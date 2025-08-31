'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'customer' }),
      })
      const data = await res.json()
      
      if (res.ok) {
        router.push('/login')
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Registration failed')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="absolute top-10 left-10 w-20 h-20 bg-amber-200 rounded-full opacity-60 animate-bounce" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-orange-300 rounded-full opacity-50 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-red-200 rounded-full opacity-40 animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-yellow-300 rounded-full opacity-70 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl opacity-5 animate-pulse">☕</div>
      </div>
      
      <Navbar />
      <div className="relative z-10 flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 animate-fadeIn">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-amber-800 mb-2">Join Our Coffee Family</h2>
          <p className="text-gray-600">Create your account to start ordering</p>
        </div>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-4 rounded-md hover:from-amber-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 font-semibold">
            Create Account ☕
          </button>
        </form>
        <div className="mt-6 space-y-3">
          <p className="text-center">
            Already have an account? <Link href="/login" className="text-amber-600 hover:underline font-medium">Login</Link>
          </p>
          <div className="text-center">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-amber-600 transition-colors duration-200">
              ← Back to Home
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}