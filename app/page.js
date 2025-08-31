'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

// Add custom CSS for animations
const customStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeInUp {
    animation: fadeInUp 0.8s ease-out forwards;
    opacity: 0;
  }
`

export default function Home() {
  const [products, setProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0 })
  const [reviews, setReviews] = useState([])
  const [user, setUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    fetchProducts()
    fetchTrendingProducts()
    fetchFeaturedProducts()
    fetchStats()
    fetchReviews()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, filterCategory, priceRange, sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (filterCategory) params.append('category', filterCategory)
      params.append('inStock', 'true')
      
      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()
      
      let filteredData = data
      
      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number)
        filteredData = data.filter(p => p.price >= min && (max ? p.price <= max : true))
      }
      
      filteredData.sort((a, b) => {
        switch(sortBy) {
          case 'price-low': return a.price - b.price
          case 'price-high': return b.price - a.price
          case 'popular': return (b.totalSold || 0) - (a.totalSold || 0)
          default: return a.name.localeCompare(b.name)
        }
      })
      
      setProducts(filteredData)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrendingProducts = async () => {
    try {
      const res = await fetch('/api/products/trending')
      const data = await res.json()
      setTrendingProducts(data)
    } catch (error) {
      console.error('Error fetching trending products:', error)
    }
  }

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch('/api/products/featured')
      const data = await res.json()
      setFeaturedProducts(data)
    } catch (error) {
      console.error('Error fetching featured products:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews')
      const data = await res.json()
      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterCategory('')
    setPriceRange('')
    setSortBy('name')
  }

  return (
    <>
      <style jsx global>{customStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-300 text-gray-800 min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>
            <div className="text-6xl opacity-20">☕</div>
          </div>
          <div className="absolute top-40 right-20 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}>
            <div className="text-4xl opacity-30">🥐</div>
          </div>
          <div className="absolute bottom-40 left-20 animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}}>
            <div className="text-5xl opacity-25">🍵</div>
          </div>
          <div className="absolute top-60 left-1/3 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '4.5s'}}>
            <div className="text-3xl opacity-20">🥪</div>
          </div>
          <div className="absolute bottom-60 right-1/4 animate-bounce" style={{animationDelay: '1.5s', animationDuration: '3.8s'}}>
            <div className="text-4xl opacity-30">🧁</div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
          
          {/* Steam Animation */}
          <div className="absolute top-1/4 right-1/4">
            <div className="relative">
              <div className="text-8xl opacity-30 animate-pulse">☕</div>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-1 h-8 bg-white/20 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
              </div>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 ml-2">
                <div className="w-1 h-6 bg-white/15 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 -ml-1">
                <div className="w-1 h-4 bg-white/10 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"></div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Animated Title */}
            <div className="mb-8">
              <h2 className="text-5xl lg:text-8xl font-bold mb-4 leading-tight text-amber-900">
                <span className="inline-block animate-fadeInUp" style={{animationDelay: '0.2s'}}>Premium</span>
                <span className="inline-block animate-fadeInUp ml-4" style={{animationDelay: '0.4s'}}>Coffee</span>
              </h2>
              <div className="text-3xl lg:text-6xl text-orange-700 font-light">
                <span className="inline-block animate-fadeInUp" style={{animationDelay: '0.6s'}}>Experience</span>
                <span className="inline-block animate-fadeInUp ml-4" style={{animationDelay: '0.8s'}}>✨</span>
              </div>
            </div>
            
            {/* Animated Description */}
            <p className="text-lg lg:text-2xl mb-8 max-w-4xl mx-auto text-gray-700 leading-relaxed animate-fadeInUp" style={{animationDelay: '1s'}}>
              Discover our handcrafted beverages, artisanal pastries, and gourmet sandwiches. 
              Every cup tells a story of passion and perfection.
            </p>
            
            {/* Mobile-Optimized Real-time Stats */}
            <div className="grid grid-cols-3 gap-2 mb-8 animate-fadeInUp" style={{animationDelay: '1.1s'}}>
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <div className="text-xl font-bold text-amber-800">{stats.users.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Customers</div>
              </div>
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <div className="text-xl font-bold text-amber-800">{stats.orders.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Orders</div>
              </div>
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <div className="text-xl font-bold text-amber-800">{stats.products}</div>
                <div className="text-xs text-gray-600">Items</div>
              </div>
            </div>
            
            {/* Animated Product Showcase */}
            <div className="flex justify-center items-center space-x-8 mb-12 animate-fadeInUp" style={{animationDelay: '1.2s'}}>
              <div className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-6xl mb-2 animate-bounce" style={{animationDelay: '0s'}}>☕</div>
                <p className="text-sm font-medium">Premium Coffee</p>
              </div>
              <div className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-6xl mb-2 animate-bounce" style={{animationDelay: '0.5s'}}>🍵</div>
                <p className="text-sm font-medium">Fresh Tea</p>
              </div>
              <div className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-6xl mb-2 animate-bounce" style={{animationDelay: '1s'}}>🥐</div>
                <p className="text-sm font-medium">Artisan Pastries</p>
              </div>
              <div className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-6xl mb-2 animate-bounce" style={{animationDelay: '1.5s'}}>🥪</div>
                <p className="text-sm font-medium">Gourmet Sandwiches</p>
              </div>
            </div>
            
            {/* Animated Buttons */}
            {!user && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeInUp" style={{animationDelay: '1.4s'}}>
                <Link 
                  href="/register" 
                  className="group bg-amber-600 text-white px-10 py-4 rounded-full font-bold hover:bg-amber-700 transition-all duration-500 text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105"
                >
                  <span className="flex items-center justify-center">
                    Start Your Journey
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                </Link>
                <Link 
                  href="#menu" 
                  className="group border-2 border-amber-600 text-amber-600 px-10 py-4 rounded-full font-bold hover:bg-amber-600 hover:text-white transition-all duration-500 text-lg transform hover:-translate-y-2 hover:scale-105"
                >
                  <span className="flex items-center justify-center">
                    Explore Menu
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">↓</span>
                  </span>
                </Link>
              </div>
            )}
            
            {user && (
              <div className="animate-fadeInUp" style={{animationDelay: '1.4s'}}>
                <Link 
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="group bg-amber-600 text-white px-10 py-4 rounded-full font-bold hover:bg-amber-700 transition-all duration-500 text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105"
                >
                  <span className="flex items-center justify-center">
                    Go to Dashboard
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-amber-600/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-amber-600/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
        
        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Product List with Search & Filter */}
      <section id="menu" className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">Our Complete Menu</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our full range of premium beverages and gourmet food items
            </p>
          </div>

          {/* Mobile-First Filters */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 mb-6 shadow-lg">
            <div className="grid grid-cols-1 gap-3 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Products</label>
                <input
                  type="text"
                  placeholder="Search coffee, tea, pastries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">All Categories</option>
                  <option value="coffee">☕ Coffee</option>
                  <option value="tea">🍵 Tea</option>
                  <option value="pastry">🥐 Pastries</option>
                  <option value="sandwich">🥪 Sandwiches</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">All Prices</option>
                  <option value="0-100">₹0 - ₹100</option>
                  <option value="100-300">₹100 - ₹300</option>
                  <option value="300-500">₹300 - ₹500</option>
                  <option value="500">₹500+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {products.length} products
              </div>
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
              <p className="mt-4 text-gray-600">Loading our delicious menu...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Show All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <div key={product._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold mb-2 w-fit ${
                          product.category === 'coffee' ? 'bg-amber-100 text-amber-800' :
                          product.category === 'tea' ? 'bg-green-100 text-green-800' :
                          product.category === 'pastry' ? 'bg-pink-100 text-pink-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {product.category.toUpperCase()}
                        </span>
                        {product.isTrending && (
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold w-fit">
                            🔥 TRENDING
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-bold w-fit mt-1">
                            ⭐ FEATURED
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-amber-600">₹{product.price}</div>
                        <div className="text-xs text-gray-500">{product.stock || 0} in stock</div>
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-3 group-hover:text-amber-600 transition-colors leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {(product.totalSold || 0) > 0 && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {product.totalSold} sold
                          </span>
                        )}
                        <span className={`w-3 h-3 rounded-full ${
                          (product.stock || 0) > 10 ? 'bg-green-400' :
                          (product.stock || 0) > 0 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}></span>
                      </div>
                      {user && user.role === 'customer' ? (
                        <Link 
                          href="/dashboard"
                          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          Order Now
                        </Link>
                      ) : !user ? (
                        <Link 
                          href="/register"
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          Join to Order
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!user && products.length > 0 && (
            <div className="text-center mt-16 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to taste perfection?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join thousands of coffee lovers who trust us for their daily dose of happiness. 
                Register now and start your coffee journey!
              </p>
              <Link 
                href="/register"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300 text-lg transform hover:-translate-y-1"
              >
                Start Ordering Today
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-slate-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">🚀 Platform Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for the perfect coffee ordering experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Role-Based Authentication</h3>
              <p className="text-gray-600">Secure login system with Customer and Admin roles, JWT token protection</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Smart Cart System</h3>
              <p className="text-gray-600">Add items to cart, manage quantities, real-time total calculation</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Inventory Management</h3>
              <p className="text-gray-600">Real-time stock tracking, automatic updates, low stock alerts</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Trending Algorithm</h3>
              <p className="text-gray-600">Products become trending with 5+ sales or admin marking, dynamic ranking</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Featured Products</h3>
              <p className="text-gray-600">Admin-curated premium selections with special highlighting</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Advanced Search & Filter</h3>
              <p className="text-gray-600">Search by name, filter by category, price range, and popularity</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Responsive Design</h3>
              <p className="text-gray-600">Mobile-first design, works perfectly on all devices and screen sizes</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Order Management</h3>
              <p className="text-gray-600">Complete order tracking, status updates, order history for users</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Beautiful Animations</h3>
              <p className="text-gray-600">Smooth transitions, hover effects, and engaging user interactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 lg:py-20 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">⭐ Featured Products</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Handpicked selections from our premium collection
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product._id} className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-3 border border-purple-100">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">FEATURED</span>
                      <span className="text-2xl font-bold text-purple-600">₹{product.price}</span>
                    </div>
                    <h3 className="font-bold text-xl mb-3 group-hover:text-purple-600 transition-colors leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {product.stock} in stock
                      </span>
                      {user && user.role === 'customer' && (
                        <Link 
                          href="/dashboard"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          Order Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending of the Day - Special Highlight */}
      {trendingProducts.length > 0 && (
        <section className="relative py-20 lg:py-32 bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 animate-pulse">
              <div className="text-8xl opacity-20">🔥</div>
            </div>
            <div className="absolute top-20 right-20 animate-bounce" style={{animationDelay: '1s'}}>
              <div className="text-6xl opacity-30">⭐</div>
            </div>
            <div className="absolute bottom-20 left-1/4 animate-pulse" style={{animationDelay: '2s'}}>
              <div className="text-7xl opacity-25">🔥</div>
            </div>
            <div className="absolute top-1/2 right-1/3 animate-bounce" style={{animationDelay: '0.5s'}}>
              <div className="text-5xl opacity-20">⚡</div>
            </div>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            {/* Animated Header */}
            <div className="text-center mb-16">
              <div className="inline-block animate-bounce mb-4">
                <span className="text-6xl lg:text-8xl">🔥</span>
              </div>
              <h2 className="text-4xl lg:text-7xl font-black mb-6 text-white leading-tight">
                <span className="animate-pulse">TRENDING</span>
                <span className="block text-3xl lg:text-5xl text-yellow-200 font-light mt-2">
                  of the Day
                </span>
              </h2>
              <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-6">
                🎆 Today's hottest picks that everyone's talking about!
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto mb-6">
                <h3 className="text-2xl font-bold text-white mb-4">🏆 Trending Levels Explained</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl mb-2">🔥</div>
                    <div className="text-yellow-300 font-bold">Level 1: Hot</div>
                    <div className="text-white/80 text-sm">5+ sales today</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl mb-2">🔥🔥</div>
                    <div className="text-orange-300 font-bold">Level 2: Viral</div>
                    <div className="text-white/80 text-sm">15+ sales today</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl mb-2">🔥🔥🔥</div>
                    <div className="text-red-300 font-bold">Level 3: Legendary</div>
                    <div className="text-white/80 text-sm">25+ sales today</div>
                  </div>
                </div>
              </div>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="text-white font-bold text-lg">
                  📈 {trendingProducts.reduce((sum, p) => sum + (p.totalSold || 0), 0)} total sales today!
                </span>
              </div>
            </div>
            
            {/* Featured Trending Product - Hero Style */}
            {trendingProducts[0] && (
              <div className="mb-16">
                <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl">
                  <div className="text-center">
                    <div className="inline-block bg-gradient-to-r from-yellow-400 to-red-500 text-black px-6 py-3 rounded-full font-black text-lg mb-6 animate-pulse">
                      🏆 #1 TRENDING TODAY
                    </div>
                    <h3 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                      {trendingProducts[0].name}
                    </h3>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                      {trendingProducts[0].description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
                      <div className="text-center">
                        <div className="text-5xl lg:text-7xl font-black text-yellow-300">
                          ₹{trendingProducts[0].price}
                        </div>
                        <div className="text-white/70 text-sm">Special Price</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl lg:text-5xl font-bold text-white">
                          {trendingProducts[0].totalSold || 0}
                        </div>
                        <div className="text-white/70 text-sm">Sold Today</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl lg:text-5xl font-bold text-green-300">
                          {trendingProducts[0].stock}
                        </div>
                        <div className="text-white/70 text-sm">Left in Stock</div>
                      </div>
                    </div>
                    {user && user.role === 'customer' ? (
                      <Link 
                        href="/dashboard"
                        className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-12 py-4 rounded-full font-black text-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                      >
                        🚀 ORDER NOW - LIMITED TIME!
                      </Link>
                    ) : (
                      <Link 
                        href="/register"
                        className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-12 py-4 rounded-full font-black text-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                      >
                        🎆 JOIN TO ORDER!
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Other Trending Items */}
            {trendingProducts.length > 1 && (
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white text-center mb-8">
                  🔥 More Hot Picks
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {trendingProducts.slice(1).map((product, index) => (
                    <div key={product._id} className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">
                          #{index + 2} {(product.totalSold || 0) >= 25 ? '🔥🔥🔥 LEGENDARY' : (product.totalSold || 0) >= 15 ? '🔥🔥 VIRAL' : '🔥 HOT'}
                        </div>
                        <h4 className="font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                          {product.name}
                        </h4>
                        <div className="text-2xl font-bold text-yellow-300 mb-2">
                          ₹{product.price}
                        </div>
                        <div className="text-white/70 text-sm mb-4">
                          {product.totalSold || 0} sold
                        </div>
                        {user && user.role === 'customer' && (
                          <Link 
                            href="/dashboard"
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg text-sm font-bold hover:shadow-lg transition-all duration-300 inline-block"
                          >
                            Order
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Bottom Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
        </section>
      )}

      {/* Customer Reviews */}
      {reviews.length > 0 && (
        <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">⭐ What Our Customers Say</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real reviews from real customers who love our coffee and service
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400 mr-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-xl">⭐</span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {review.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{review.user?.name || 'Anonymous'}</div>
                      <div className="text-xs text-gray-500">Verified Customer</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {user && user.role === 'customer' && (
              <div className="text-center mt-12">
                <Link 
                  href="/dashboard"
                  className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  ⭐ Write Your Review
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                ☕ Coffee Shop
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Crafting exceptional coffee experiences since day one. Every cup is a journey, 
                every sip a moment of pure bliss.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <span className="text-white font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <span className="text-white font-bold">@</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <span className="text-white font-bold">t</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
              <div className="space-y-3">
                <Link href="/login" className="block text-gray-400 hover:text-white transition-colors">Login</Link>
                <Link href="/register" className="block text-gray-400 hover:text-white transition-colors">Register</Link>
                <Link href="#menu" className="block text-gray-400 hover:text-white transition-colors">Menu</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Contact Info</h4>
              <div className="text-gray-400 space-y-3">
                <p className="flex items-center"><span className="mr-2">📍</span> 123 Coffee Street, Bean City</p>
                <p className="flex items-center"><span className="mr-2">📞</span> (555) 123-CAFE</p>
                <p className="flex items-center"><span className="mr-2">✉️</span> hello@coffeeshop.com</p>
                <p className="flex items-center"><span className="mr-2">🕒</span> Mon-Sun: 6AM - 10PM</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 Coffee Shop. Crafted with ❤️ for coffee lovers worldwide.</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}