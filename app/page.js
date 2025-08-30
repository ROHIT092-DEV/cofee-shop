'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-amber-800 to-orange-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="flex justify-between items-center mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                ☕ Coffee Shop
              </h1>
              <button className="sm:hidden text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {user ? (
                <>
                  <span className="text-sm sm:text-base">Welcome, {user.name}!</span>
                  <Link 
                    href={user.role === 'admin' ? '/admin' : '/dashboard'} 
                    className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg text-center transition-colors text-sm sm:text-base"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={logout} 
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg text-center transition-colors text-sm sm:text-base"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-center transition-colors text-sm sm:text-base"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-800 to-orange-800 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-6xl font-bold mb-6">
            Welcome to Our Coffee Shop
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Experience the finest coffee, freshly brewed with passion. From espresso to pastries, we serve quality that awakens your senses.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="bg-white text-amber-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
              >
                Get Started
              </Link>
              <Link 
                href="/login" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-800 transition-colors text-lg"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Fast Service</h3>
              <p className="text-gray-600">Quick ordering and preparation. Your coffee ready when you need it.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">☕</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Premium Quality</h3>
              <p className="text-gray-600">Finest beans sourced globally. Every cup crafted to perfection.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Easy Ordering</h3>
              <p className="text-gray-600">Simple online ordering system. Pay at counter when you collect.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">Our Menu</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated selection of coffee, tea, pastries, and sandwiches
            </p>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">☕</div>
              <p className="text-gray-500 text-lg">Loading our delicious menu...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors">
                        {product.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.category === 'coffee' ? 'bg-amber-100 text-amber-800' :
                        product.category === 'tea' ? 'bg-green-100 text-green-800' :
                        product.category === 'pastry' ? 'bg-pink-100 text-pink-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {product.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-amber-600">
                        ${product.price}
                      </span>
                      {user && user.role === 'customer' && (
                        <Link 
                          href="/dashboard"
                          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Order Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!user && products.length > 0 && (
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-6">Ready to order? Join us today!</p>
              <Link 
                href="/register"
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg"
              >
                Start Ordering
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                ☕ Coffee Shop
              </h3>
              <p className="text-gray-400">
                Serving the finest coffee and treats with passion since day one.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/login" className="block text-gray-400 hover:text-white transition-colors">Login</Link>
                <Link href="/register" className="block text-gray-400 hover:text-white transition-colors">Register</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="text-gray-400 space-y-2">
                <p>📍 123 Coffee Street</p>
                <p>📞 (555) 123-CAFE</p>
                <p>✉️ hello@coffeeshop.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Coffee Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}