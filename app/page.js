'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

// Add custom CSS for animations
const customStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .animate-slideInLeft {
    animation: slideInLeft 0.6s ease-out forwards;
  }
  
  .animate-slideInRight {
    animation: slideInRight 0.6s ease-out forwards;
  }
  
  .animate-delay-100 { animation-delay: 0.1s; }
  .animate-delay-200 { animation-delay: 0.2s; }
  .animate-delay-300 { animation-delay: 0.3s; }
  .animate-delay-400 { animation-delay: 0.4s; }
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
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-200 text-gray-800 py-16 md:py-24">
        {/* Simplified Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-4 md:left-10 animate-pulse opacity-20">
            <div className="text-2xl md:text-4xl">☕</div>
          </div>
          <div className="absolute top-20 right-4 md:right-20 animate-pulse opacity-30">
            <div className="text-xl md:text-3xl">🥐</div>
          </div>
          <div className="absolute bottom-20 left-1/4 animate-pulse opacity-25">
            <div className="text-2xl md:text-4xl">🍵</div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 text-amber-900 animate-fadeInUp">
                Premium Coffee Experience
              </h1>
              <p className="text-lg md:text-xl text-orange-700 animate-fadeInUp animate-delay-100">Crafted with passion ✨</p>
            </div>
            
            {/* Description */}
            <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto text-gray-700 leading-relaxed animate-fadeInUp animate-delay-200">
              Discover our handcrafted beverages, artisanal pastries, and gourmet sandwiches.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto animate-slideInLeft animate-delay-300">
              <div className="text-center bg-white/30 backdrop-blur-sm rounded-lg p-3 hover:bg-white/40 transition-colors duration-200">
                <div className="text-lg md:text-xl font-bold text-amber-800">{stats.users.toLocaleString()}</div>
                <div className="text-xs md:text-sm text-gray-600">Customers</div>
              </div>
              <div className="text-center bg-white/30 backdrop-blur-sm rounded-lg p-3 hover:bg-white/40 transition-colors duration-200">
                <div className="text-lg md:text-xl font-bold text-amber-800">{stats.orders.toLocaleString()}</div>
                <div className="text-xs md:text-sm text-gray-600">Orders</div>
              </div>
              <div className="text-center bg-white/30 backdrop-blur-sm rounded-lg p-3 hover:bg-white/40 transition-colors duration-200">
                <div className="text-lg md:text-xl font-bold text-amber-800">{stats.products}</div>
                <div className="text-xs md:text-sm text-gray-600">Items</div>
              </div>
            </div>
            
            {/* Product Icons */}
            <div className="flex justify-center items-center space-x-4 md:space-x-8 mb-8 animate-slideInRight animate-delay-300">
              <div className="text-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                <div className="text-2xl md:text-3xl mb-1">☕</div>
                <p className="text-xs md:text-sm font-medium">Coffee</p>
              </div>
              <div className="text-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                <div className="text-2xl md:text-3xl mb-1">🍵</div>
                <p className="text-xs md:text-sm font-medium">Tea</p>
              </div>
              <div className="text-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                <div className="text-2xl md:text-3xl mb-1">🥐</div>
                <p className="text-xs md:text-sm font-medium">Pastries</p>
              </div>
              <div className="text-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                <div className="text-2xl md:text-3xl mb-1">🥪</div>
                <p className="text-xs md:text-sm font-medium">Sandwiches</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto animate-fadeInUp animate-delay-400">
                <Link 
                  href="/register" 
                  className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 hover:scale-105 transition-all duration-200 transform"
                >
                  Start Ordering
                </Link>
                <Link 
                  href="#menu" 
                  className="border-2 border-amber-600 text-amber-600 px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 hover:text-white hover:scale-105 transition-all duration-200 transform"
                >
                  View Menu
                </Link>
              </div>
            )}
            
            {user && (
              <div className="animate-fadeInUp animate-delay-400">
                <Link 
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 hover:scale-105 transition-all duration-200 transform"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Product List with Search & Filter */}
      <section id="menu" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">Our Menu</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto">
              Explore our premium beverages and gourmet food items
            </p>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">All Categories</option>
                  <option value="coffee">☕ Coffee</option>
                  <option value="tea">🍵 Tea</option>
                  <option value="pastry">🥐 Pastries</option>
                  <option value="sandwich">🥪 Sandwiches</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">All Prices</option>
                  <option value="0-100">₹0 - ₹100</option>
                  <option value="100-300">₹100 - ₹300</option>
                  <option value="300-500">₹300 - ₹500</option>
                  <option value="500">₹500+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {products.length} products
              </div>
              <button
                onClick={clearFilters}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              <p className="mt-3 text-gray-600">Loading menu...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={clearFilters}
                className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
              >
                Show All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product, index) => (
                <div 
                  key={product._id} 
                  className="bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium w-fit ${
                          product.category === 'coffee' ? 'bg-amber-100 text-amber-800' :
                          product.category === 'tea' ? 'bg-green-100 text-green-800' :
                          product.category === 'pastry' ? 'bg-pink-100 text-pink-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {product.category.toUpperCase()}
                        </span>
                        <div className="flex gap-1">
                          {product.isTrending && (
                            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium animate-pulse">
                              🔥 TRENDING
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-medium">
                              ⭐ FEATURED
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-amber-600">₹{product.price}</div>
                        <div className="text-xs text-gray-500">{product.stock || 0} in stock</div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-base mb-2 text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {(product.totalSold || 0) > 0 && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {product.totalSold} sold
                          </span>
                        )}
                        <span className={`w-2 h-2 rounded-full animate-pulse ${
                          (product.stock || 0) > 10 ? 'bg-green-400' :
                          (product.stock || 0) > 0 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}></span>
                      </div>
                      {user && user.role === 'customer' ? (
                        <Link 
                          href="/dashboard"
                          className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 hover:scale-105 transition-all duration-200 transform"
                        >
                          Order Now
                        </Link>
                      ) : !user ? (
                        <Link 
                          href="/register"
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 hover:scale-105 transition-all duration-200 transform"
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
            <div className="text-center mt-8 bg-amber-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Ready to order?</h3>
              <p className="text-gray-600 mb-4 max-w-lg mx-auto">
                Join our coffee community and start ordering your favorites today!
              </p>
              <Link 
                href="/register"
                className="bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
              >
                Start Ordering
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 animate-fadeInUp">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">Why Choose Us</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto">
              Everything you need for the perfect coffee experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-slideInLeft animate-delay-100">
              <div className="text-3xl mb-3 hover:scale-110 transition-transform duration-200">🔐</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Secure Login</h3>
              <p className="text-gray-600 text-sm">Safe and secure authentication for all users</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-fadeInUp animate-delay-200">
              <div className="text-3xl mb-3 hover:scale-110 transition-transform duration-200">🛒</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Easy Ordering</h3>
              <p className="text-gray-600 text-sm">Simple cart system with real-time calculations</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-slideInRight animate-delay-100">
              <div className="text-3xl mb-3 hover:scale-110 transition-transform duration-200">📦</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Fresh Stock</h3>
              <p className="text-gray-600 text-sm">Real-time inventory with fresh products daily</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-slideInLeft animate-delay-300">
              <div className="text-3xl mb-3 hover:scale-110 transition-transform duration-200">🔥</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Trending Items</h3>
              <p className="text-gray-600 text-sm">Discover what's popular with other customers</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-fadeInUp animate-delay-400">
              <div className="text-3xl mb-3 hover:scale-110 transition-transform duration-200">⭐</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Premium Selection</h3>
              <p className="text-gray-600 text-sm">Curated featured products for the best experience</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-slideInRight animate-delay-300">
              <div className="text-3xl mb-3 hover:scale-110 transition-transform duration-200">📱</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Mobile Friendly</h3>
              <p className="text-gray-600 text-sm">Perfect experience on all devices and screens</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">⭐ Featured Products</h2>
              <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto">
                Handpicked selections from our premium collection
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-purple-200">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-medium">⭐ FEATURED</span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">₹{product.price}</div>
                        <div className="text-xs text-gray-500">{product.stock} in stock</div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-base mb-2 text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Premium quality
                      </span>
                      {user && user.role === 'customer' && (
                        <Link 
                          href="/dashboard"
                          className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
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

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-red-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">🔥 Trending Now</h2>
              <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto">
                Popular items that customers love
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingProducts.map((product, index) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-red-200">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                        🔥 #{index + 1} TRENDING
                      </span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">₹{product.price}</div>
                        <div className="text-xs text-gray-500">{product.stock} in stock</div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-base mb-2 text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.totalSold || 0} sold today
                      </span>
                      {user && user.role === 'customer' && (
                        <Link 
                          href="/dashboard"
                          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
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

      {/* Customer Reviews */}
      {reviews.length > 0 && (
        <section className="py-12 md:py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">⭐ Customer Reviews</h2>
              <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto">
                What our customers say about us
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-sm">⭐</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3 text-sm italic">
                    "{review.comment}"
                  </p>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-2 text-sm">
                      {review.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{review.user?.name || 'Anonymous'}</div>
                      <div className="text-xs text-gray-500">Verified Customer</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {user && user.role === 'customer' && (
              <div className="text-center mt-8">
                <Link 
                  href="/dashboard"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  ⭐ Write Your Review
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3 text-amber-400">
                ☕ Coffee Shop
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                Crafting exceptional coffee experiences since day one.
              </p>
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                  <span className="text-white text-sm font-bold">f</span>
                </div>
                <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-700 transition-colors">
                  <span className="text-white text-sm font-bold">@</span>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <span className="text-white text-sm font-bold">t</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/login" className="block text-gray-400 hover:text-white transition-colors text-sm">Login</Link>
                <Link href="/register" className="block text-gray-400 hover:text-white transition-colors text-sm">Register</Link>
                <Link href="#menu" className="block text-gray-400 hover:text-white transition-colors text-sm">Menu</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact Info</h4>
              <div className="text-gray-400 space-y-2 text-sm">
                <p className="flex items-center"><span className="mr-2">📍</span> 123 Coffee Street, Bean City</p>
                <p className="flex items-center"><span className="mr-2">📞</span> (555) 123-CAFE</p>
                <p className="flex items-center"><span className="mr-2">✉️</span> hello@coffeeshop.com</p>
                <p className="flex items-center"><span className="mr-2">🕒</span> Mon-Sun: 6AM - 10PM</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">&copy; 2024 Coffee Shop. Made with ❤️ for coffee lovers.</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}