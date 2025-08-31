'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function CustomerDashboard() {
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('menu')
  const [showPayment, setShowPayment] = useState(false)
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
          total: parseFloat(getTotalPrice())
        })
      })

      if (res.ok) {
        setCart([])
        setShowPayment(false)
        fetchOrders()
        alert('Order placed successfully!')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Error placing order')
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
                      <span className="text-xl sm:text-2xl font-bold text-amber-600">${product.price}</span>
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
                        <div className="text-xs sm:text-sm text-gray-600">${item.price} each</div>
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
                      <span>Total: ${getTotalPrice()}</span>
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
                      <span className={`px-3 py-1 rounded text-xs sm:text-sm font-medium self-start ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'ready' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="flex-1 pr-2">{item.product?.name || 'Product'} × {item.quantity}</span>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-bold text-base">
                        <span>Total: ${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-8 max-w-md w-full">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Manual Payment</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 sm:p-4 rounded">
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Order Summary</h4>
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="flex-1 pr-2">{item.name} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 font-bold text-sm sm:text-base">
                    Total: ${getTotalPrice()}
                  </div>
                </div>
                <div className="bg-blue-50 p-3 sm:p-4 rounded">
                  <p className="text-xs sm:text-sm text-blue-800">
                    Please pay ${getTotalPrice()} at the counter when you collect your order.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <button 
                    onClick={() => setShowPayment(false)}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded hover:bg-gray-600 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={placeOrder}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 text-sm sm:text-base"
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}