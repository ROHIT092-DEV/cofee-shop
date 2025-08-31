'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      <div className="flex items-center space-x-2">
        <span>{type === 'success' ? '✓' : '⚠'}</span>
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">×</button>
      </div>
    </div>
  )
}

export default function CustomerDashboard() {
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('menu')
  const [showPayment, setShowPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [toast, setToast] = useState(null)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (!token || !userData) {
      router.push('/login')
      return
    }
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'customer') {
      router.push('/admin')
      return
    }
    setUser(parsedUser)
    fetchProducts()
    fetchOrders()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, filterCategory])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (filterCategory) params.append('category', filterCategory)
      params.append('inStock', 'true')
      
      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id)
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0
    
    if (currentQuantityInCart >= (product.stock || 0)) {
      setToast({ message: `Sorry, only ${product.stock} items available in stock!`, type: 'error' })
      return
    }
    
    if (existingItem) {
      setCart(cart.map(item => 
        item._id === product._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
    } else {
      const product = products.find(p => p._id === productId)
      if (newQuantity > (product?.stock || 0)) {
        setToast({ message: `Sorry, only ${product?.stock} items available in stock!`, type: 'error' })
        return
      }
      
      setCart(cart.map(item => 
        item._id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ))
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  const submitReview = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment.trim()
        })
      })

      if (res.ok) {
        setReviewRating(0)
        setReviewComment('')
        setToast({ message: 'Thank you for your review! It will be published after approval. ⭐', type: 'success' })
      } else {
        const error = await res.json()
        setToast({ message: error.error || 'Error submitting review', type: 'error' })
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      setToast({ message: 'Error submitting review. Please try again.', type: 'error' })
    }
  }



  const placeOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      const orderItems = cart.map(item => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price
      }))
      
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          total: parseFloat(getTotalPrice()),
          paymentMethod,
          paymentStatus: paymentMethod === 'upi' ? 'pending_verification' : 'cash'
        })
      })

      if (res.ok) {
        setCart([])
        setShowPayment(false)
        fetchOrders()
        fetchProducts()
        if (paymentMethod === 'upi') {
          setToast({ message: 'Order placed! Admin will verify payment and confirm. 📱', type: 'success' })
        } else {
          setToast({ message: 'Order placed successfully! 🎉', type: 'success' })
        }
      }
    } catch (error) {
      console.error('Error placing order:', error)
      setToast({ message: 'Error placing order. Please try again.', type: 'error' })
    }
  }





  if (!user) return <div className="flex items-center justify-center min-h-screen"><div className="text-lg">Loading...</div></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Customer Tabs */}
      <div className="bg-amber-800 text-white p-4">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="flex space-x-2 mb-2 sm:mb-0">
              <button 
                onClick={() => setActiveTab('menu')} 
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${activeTab === 'menu' ? 'bg-amber-600 shadow-lg' : 'bg-amber-700 hover:bg-amber-600'}`}
              >
                🍽️ Menu
              </button>
              <button 
                onClick={() => setActiveTab('orders')} 
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${activeTab === 'orders' ? 'bg-amber-600 shadow-lg' : 'bg-amber-700 hover:bg-amber-600'}`}
              >
                📋 My Orders
              </button>
              <button 
                onClick={() => setActiveTab('review')} 
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${activeTab === 'review' ? 'bg-amber-600 shadow-lg' : 'bg-amber-700 hover:bg-amber-600'}`}
              >
                ⭐ Review Shop
              </button>
            </div>
            <div className="text-sm sm:text-base text-amber-100">
              Customer Dashboard
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'menu' && (
          <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
            <div className="lg:col-span-2">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Menu</h2>
              <div className="mb-4 space-y-2">
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Categories</option>
                  <option value="coffee">Coffee</option>
                  <option value="tea">Tea</option>
                  <option value="pastry">Pastry</option>
                  <option value="sandwich">Sandwich</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {products.map((product) => (
                  <div key={product._id} className={`bg-white rounded-lg shadow-md p-4 sm:p-6 ${
                    (product.stock || 0) === 0 ? 'opacity-50' : ''
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold">{product.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        (product.stock || 0) > 10 ? 'bg-green-100 text-green-800' :
                        (product.stock || 0) > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {(product.stock || 0) > 0 ? `${product.stock} left` : 'Out of stock'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl sm:text-2xl font-bold text-amber-600">₹{product.price}</span>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={(product.stock || 0) === 0}
                        className={`px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${
                          (product.stock || 0) === 0 
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-amber-600 text-white hover:bg-amber-700'
                        }`}
                      >
                        {(product.stock || 0) === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 h-fit">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h3>
              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item._id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 p-2 border-b space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <div className="font-medium text-sm sm:text-base">{item.name}</div>
                        <div className="text-xs sm:text-sm text-gray-600">₹{item.price} each</div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end space-x-2">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="bg-gray-200 px-2 py-1 rounded text-sm"
                          >
                            -
                          </button>
                          <span className="px-2 text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="bg-gray-200 px-2 py-1 rounded text-sm"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center font-bold text-base sm:text-lg">
                      <span>Total: ₹{getTotalPrice()}</span>
                    </div>
                    <button 
                      onClick={() => setShowPayment(true)}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded mt-4 hover:bg-green-700 text-base font-medium"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Orders</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="font-bold text-base sm:text-lg">Order #{order._id.slice(-6)}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded text-xs sm:text-sm font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'ready' ? 'bg-green-100 text-green-800' :
                          order.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'pending' && '⏳ Order Received'}
                          {order.status === 'preparing' && '👨‍🍳 Being Prepared'}
                          {order.status === 'ready' && '🔔 Ready for Pickup'}
                          {order.status === 'completed' && '✅ Completed'}
                          {order.status === 'cancelled' && '❌ Cancelled'}
                        </span>
                        
                        {/* Payment Status for UPI orders */}
                        {order.paymentMethod === 'upi' && order.paymentStatus && (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            order.paymentStatus === 'pending_verification' ? 'bg-orange-100 text-orange-800' :
                            order.paymentStatus === 'verified' ? 'bg-green-100 text-green-800' :
                            order.paymentStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.paymentStatus === 'pending_verification' && '📱 Payment Pending'}
                            {order.paymentStatus === 'verified' && '✅ Payment Verified'}
                            {order.paymentStatus === 'rejected' && '❌ Payment Rejected'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="flex-1 pr-2">{item.product?.name || 'Product'} × {item.quantity}</span>
                          <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center font-bold text-base">
                        <span>Total: ₹{order.total.toFixed(2)}</span>
                        <span className="text-xs text-gray-500">
                          {order.paymentMethod === 'upi' ? '📱 UPI Payment' : '💵 Counter Payment'}
                        </span>
                      </div>
                      
                      {/* Order Progress Indicator */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Order Progress</span>
                          <span>
                            {order.status === 'pending' && '1/4'}
                            {order.status === 'preparing' && '2/4'}
                            {order.status === 'ready' && '3/4'}
                            {order.status === 'completed' && '4/4'}
                            {order.status === 'cancelled' && 'Cancelled'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full transition-all duration-500 ${
                            order.status === 'pending' ? 'w-1/4 bg-yellow-500' :
                            order.status === 'preparing' ? 'w-2/4 bg-blue-500' :
                            order.status === 'ready' ? 'w-3/4 bg-green-500' :
                            order.status === 'completed' ? 'w-full bg-purple-500' :
                            order.status === 'cancelled' ? 'w-full bg-red-500' :
                            'w-0'
                          }`}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Received</span>
                          <span>Preparing</span>
                          <span>Ready</span>
                          <span>Complete</span>
                        </div>
                      </div>
                      
                      {/* Estimated Time */}
                      {order.status === 'preparing' && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                          ⏱️ Estimated time: 10-15 minutes
                        </div>
                      )}
                      
                      {order.status === 'ready' && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800 animate-pulse">
                          🔔 Your order is ready for pickup!
                        </div>
                      )}
                      

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'review' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Review Our Shop</h2>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Share Your Experience</h3>
                <p className="text-gray-600">Help other customers by sharing your thoughts about our coffee shop and service!</p>
              </div>
              
              <div className="max-w-md mx-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex justify-center space-x-2">
                      {[1,2,3,4,5].map(star => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`text-3xl transition-all duration-200 hover:scale-110 ${
                            star <= (reviewRating || 0) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2">
                      {reviewRating === 5 ? 'Excellent!' : 
                       reviewRating === 4 ? 'Very Good!' :
                       reviewRating === 3 ? 'Good!' :
                       reviewRating === 2 ? 'Fair' :
                       reviewRating === 1 ? 'Poor' : 'Select a rating'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Tell us about your experience with our coffee shop, service, ambiance, or anything else..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      rows="4"
                      maxLength="500"
                    />
                    <p className="text-xs text-gray-500 mt-1">{reviewComment.length}/500 characters</p>
                  </div>
                  
                  <button
                    onClick={submitReview}
                    disabled={!reviewRating || !reviewComment.trim()}
                    className="w-full bg-amber-600 text-white py-3 px-4 rounded-md hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-base font-medium transition-all duration-200"
                  >
                    Submit Review
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Your review will be reviewed by our team before being published on our website.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Payment Options</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 sm:p-4 rounded">
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Order Summary</h4>
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="flex-1 pr-2">{item.name} × {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 font-bold text-sm sm:text-base">
                    Total: ₹{getTotalPrice()}
                  </div>
                </div>
                
                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm sm:text-base">Choose Payment Method</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="upi" 
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-blue-600"
                      />
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">📱</span>
                        <span className="font-medium">UPI Payment</span>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="counter" 
                        checked={paymentMethod === 'counter'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-blue-600"
                      />
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">💵</span>
                        <span className="font-medium">Pay at Counter</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* UPI Payment Section */}
                {paymentMethod === 'upi' && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-center">
                      <h5 className="font-semibold mb-3">Scan QR Code to Pay</h5>
                      
                      {/* Large QR Code Image */}
                      <div className="bg-white p-6 rounded-xl shadow-lg inline-block mb-6">
                        <img 
                          src="/qr-code.png" 
                          alt="UPI QR Code" 
                          className="w-64 h-64 sm:w-80 sm:h-80 object-contain mx-auto"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                        <div className="w-64 h-64 sm:w-80 sm:h-80 bg-gray-200 flex items-center justify-center text-gray-500 mx-auto" style={{display: 'none'}}>
                          <div className="text-center">
                            <div className="text-6xl mb-4">📱</div>
                            <div className="text-lg font-medium">Add your QR code</div>
                            <div className="text-sm mt-2 text-gray-400">Save as qr-code.png in public folder</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1">₹{getTotalPrice()}</div>
                          <div className="text-sm opacity-90">Scan with any UPI app to pay</div>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <div className="flex items-center space-x-2 text-amber-800">
                          <span className="text-xl">ℹ️</span>
                          <div className="text-sm">
                            <p className="font-medium">After payment, place your order.</p>
                            <p>Admin will verify payment before confirming.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Counter Payment Section */}
                {paymentMethod === 'counter' && (
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-amber-800">
                      <span className="text-xl">ℹ️</span>
                      <p className="text-sm">
                        Please pay ₹{getTotalPrice()} at the counter when you collect your order.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <button 
                    onClick={() => setShowPayment(false)}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded hover:bg-gray-600 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={placeOrder}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 text-sm sm:text-base transition-all duration-200"
                  >
                    {paymentMethod === 'upi' ? 'Place Order (Pending Verification)' : 'Confirm Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  )
}