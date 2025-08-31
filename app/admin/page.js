'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'coffee',
    stock: 100,
    isTrending: false,
    isFeatured: false,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    setUser(parsedUser);
    fetchProducts();
    fetchOrders();
    fetchUsers();
    fetchReviews();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, filterCategory]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterCategory) params.append('category', filterCategory);
      params.append('inStock', 'false');
      
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/reviews', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const approveReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isApproved: true }),
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
        }),
      });

      if (res.ok) {
        setNewProduct({
          name: '',
          description: '',
          price: '',
          category: 'coffee',
          stock: 100,
          isTrending: false,
          isFeatured: false,
        });
        fetchProducts();
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const verifyPayment = async (orderId, isVerified) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          paymentStatus: isVerified ? 'verified' : 'rejected',
          status: isVerified ? 'preparing' : 'cancelled'
        }),
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };



  const updateStock = async (productId, newStock) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: newStock, inStock: newStock > 0 }),
      });

      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingProduct.name,
          description: editingProduct.description,
          price: parseFloat(editingProduct.price),
          category: editingProduct.category,
          stock: parseInt(editingProduct.stock),
          isTrending: editingProduct.isTrending,
          isFeatured: editingProduct.isFeatured,
        }),
      });

      if (res.ok) {
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setShowDeleteModal(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };



  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Admin Tabs */}
      <div className="bg-red-800 text-white p-4">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="flex space-x-2 mb-2 sm:mb-0">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                  activeTab === 'products' ? 'bg-red-600 shadow-lg' : 'bg-red-700 hover:bg-red-600'
                }`}
              >
                📦 Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                  activeTab === 'orders' ? 'bg-red-600 shadow-lg' : 'bg-red-700 hover:bg-red-600'
                }`}
              >
                📋 Orders ({orders.filter((o) => o.status !== 'completed').length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                  activeTab === 'users' ? 'bg-red-600 shadow-lg' : 'bg-red-700 hover:bg-red-600'
                }`}
              >
                👥 Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                  activeTab === 'reviews' ? 'bg-red-600 shadow-lg' : 'bg-red-700 hover:bg-red-600'
                }`}
              >
                ⭐ Reviews ({reviews.filter(r => !r.isApproved).length})
              </button>
            </div>
            <div className="text-sm sm:text-base text-red-100">
              Admin Panel
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'products' && (
          <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                Add New Product
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-base"
                    rows="3"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-base"
                    >
                      <option value="coffee">Coffee</option>
                      <option value="tea">Tea</option>
                      <option value="pastry">Pastry</option>
                      <option value="sandwich">Sandwich</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newProduct.isTrending}
                      onChange={(e) => setNewProduct({ ...newProduct, isTrending: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Trending</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newProduct.isFeatured}
                      onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 text-base font-medium"
                >
                  Add Product
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                Products ({products.length})
              </h2>
              <div className="mb-4 space-y-2">
                <input
                  type="text"
                  placeholder="Search products..."
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
              <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className={`border rounded-lg p-3 sm:p-4 ${
                      (product.stock || 0) <= (product.lowStockThreshold || 10) ? 'border-red-300 bg-red-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-base">{product.name}</h3>
                        <div className="flex space-x-1 mt-1">
                          {product.isTrending && <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">TRENDING</span>}
                          {product.isFeatured && <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-bold">FEATURED</span>}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        (product.stock || 0) > (product.lowStockThreshold || 10) ? 'bg-green-100 text-green-800' :
                        (product.stock || 0) > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Stock: {product.stock || 0}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <span className="font-bold text-green-600 text-lg">
                          ₹{product.price}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Sold: {product.totalSold || 0}
                        </div>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs sm:text-sm">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3 space-x-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={product.stock || 0}
                          onChange={(e) => updateStock(product._id, parseInt(e.target.value))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          min="0"
                        />
                        <span className="text-xs text-gray-500">Stock</span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(product)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">
                Order Management
              </h2>
              <button
                onClick={() => {
                  const testOrder = {
                    _id: 'test-upi-order',
                    user: { name: 'Test Customer' },
                    items: [{ product: { name: 'Test Coffee' }, quantity: 1, price: 50 }],
                    total: 50,
                    status: 'pending',
                    paymentMethod: 'upi',
                    paymentStatus: 'pending_verification',
                    createdAt: new Date().toISOString()
                  };
                  setOrders([testOrder, ...orders.filter(o => o._id !== 'test-upi-order')]);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                Show Payment Verification
              </button>
            </div>
            
            {/* Payment Verification Section - Always show if there are UPI orders */}
            {(() => {
              const pendingUPIOrders = orders.filter(order => order.paymentMethod === 'upi' && order.paymentStatus === 'pending_verification');
              console.log('Checking for UPI orders:', pendingUPIOrders);
              return pendingUPIOrders.length > 0;
            })() && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 mb-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-500 text-white rounded-full p-2 mr-3">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-yellow-800">🔔 Payment Verification Required</h3>
                    <p className="text-yellow-700">UPI payments waiting for your approval</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {orders.filter(order => order.paymentMethod === 'upi' && order.paymentStatus === 'pending_verification').map((order) => (
                    <div key={order._id} className="bg-white border-2 border-yellow-200 rounded-lg p-4 shadow-md">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                        <div>
                          <h4 className="font-bold text-lg text-gray-800">Order #{order._id.slice(-6)}</h4>
                          <p className="text-gray-600">Customer: {order.user?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right mt-2 sm:mt-0">
                          <div className="text-2xl font-bold text-green-600">₹{order.total.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">Amount to verify</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <h5 className="font-medium text-gray-700 mb-2">Order Items:</h5>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.product?.name || 'Product'} × {item.quantity}</span>
                              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => {
                            if (order._id === 'test-upi-order') {
                              // Handle test order locally
                              setOrders(orders.map(o => 
                                o._id === 'test-upi-order' 
                                  ? { ...o, paymentStatus: 'verified', status: 'preparing' }
                                  : o
                              ));
                              alert('✅ Payment approved! Order is now preparing.');
                            } else {
                              verifyPayment(order._id, true);
                            }
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          ✅ PAYMENT RECEIVED - APPROVE ORDER
                        </button>
                        <button
                          onClick={() => {
                            if (order._id === 'test-upi-order') {
                              // Handle test order locally
                              setOrders(orders.map(o => 
                                o._id === 'test-upi-order' 
                                  ? { ...o, paymentStatus: 'rejected', status: 'cancelled' }
                                  : o
                              ));
                              alert('❌ Payment rejected! Order has been cancelled.');
                            } else {
                              verifyPayment(order._id, false);
                            }
                          }}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          ❌ PAYMENT NOT RECEIVED - REJECT ORDER
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-lg shadow-md p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="font-bold text-base sm:text-lg">
                          Order #{order._id.slice(-6)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Customer: {order.user?.name || 'Unknown'}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                          className={`w-full sm:w-auto px-3 py-2 rounded text-sm font-medium border ${
                            order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'preparing'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'ready'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="completed">Completed</option>
                        </select>
                        
                        {/* Quick Action Buttons */}
                        {order.status === 'pending' && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => updateOrderStatus(order._id, 'preparing')}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                            >
                              ✅ Accept Order
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order._id, 'cancelled')}
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                            >
                              ❌ Reject
                            </button>
                          </div>
                        )}
                        
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'ready')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                          >
                            🔔 Mark Ready
                          </button>
                        )}
                        
                        {order.status === 'ready' && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'completed')}
                            className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700"
                          >
                            ✅ Complete Order
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span className="flex-1 pr-2">
                            {item.product?.name || 'Product'} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                        <span className="font-bold text-base">
                          Total: ₹{order.total.toFixed(2)}
                        </span>
                        <div className="text-xs sm:text-sm text-gray-600">
                          Payment: {order.paymentMethod === 'upi' ? 'UPI' : 'Counter'}
                          {order.paymentStatus && (
                            <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                              order.paymentStatus === 'pending_verification' ? 'bg-yellow-100 text-yellow-800' :
                              order.paymentStatus === 'verified' ? 'bg-green-100 text-green-800' :
                              order.paymentStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.paymentStatus.replace('_', ' ').toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                      

                      
                      {order.paymentStatus === 'verified' && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                          ✅ Payment verified by admin
                        </div>
                      )}
                      
                      {order.paymentStatus === 'rejected' && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                          ❌ Payment rejected - Order cancelled
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              User Management
            </h2>
            
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="space-y-4">
                {users.map((userData) => (
                  <div key={userData._id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{userData.name}</h3>
                      <p className="text-gray-600 text-sm">{userData.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          userData.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {userData.role === 'admin' ? '🔑 Admin' : '👤 Customer'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Joined: {new Date(userData.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <select
                        value={userData.role}
                        onChange={(e) => updateUserRole(userData._id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                        disabled={userData._id === user._id}
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                      
                      {userData._id !== user._id && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete user ${userData.name}?`)) {
                              deleteUser(userData._id);
                            }
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Review Management
            </h2>
            
            <div className="space-y-6">
              {/* Pending Reviews */}
              {reviews.filter(r => !r.isApproved).length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h3 className="text-lg font-bold mb-4 text-orange-600">⏳ Pending Approval ({reviews.filter(r => !r.isApproved).length})</h3>
                  <div className="space-y-4">
                    {reviews.filter(r => !r.isApproved).map((review) => (
                      <div key={review._id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <div className="flex text-yellow-400 mr-3">
                              {[...Array(review.rating)].map((_, i) => (
                                <span key={i} className="text-lg">⭐</span>
                              ))}
                            </div>
                            <div>
                              <div className="font-semibold">{review.user?.name || 'Anonymous'}</div>
                              <div className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleString()}</div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => approveReview(review._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Delete this review?')) {
                                  deleteReview(review._id);
                                }
                              }}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              ❌ Delete
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 italic">"{review.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Approved Reviews */}
              {reviews.filter(r => r.isApproved).length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h3 className="text-lg font-bold mb-4 text-green-600">✅ Published Reviews ({reviews.filter(r => r.isApproved).length})</h3>
                  <div className="space-y-4">
                    {reviews.filter(r => r.isApproved).map((review) => (
                      <div key={review._id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <div className="flex text-yellow-400 mr-3">
                              {[...Array(review.rating)].map((_, i) => (
                                <span key={i} className="text-lg">⭐</span>
                              ))}
                            </div>
                            <div>
                              <div className="font-semibold">{review.user?.name || 'Anonymous'}</div>
                              <div className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleString()}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm('Remove this review from website?')) {
                                deleteReview(review._id);
                              }
                            }}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-gray-700 italic">"{review.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {reviews.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="text-6xl mb-4">⭐</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600">Customer reviews will appear here for approval.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Edit Product</h3>
              <form onSubmit={handleEditProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows="3"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="coffee">Coffee</option>
                    <option value="tea">Tea</option>
                    <option value="pastry">Pastry</option>
                    <option value="sandwich">Sandwich</option>
                  </select>
                </div>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingProduct.isTrending}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isTrending: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Trending</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFeatured}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured</span>
                  </label>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    Update Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-xl font-bold mb-4 text-red-600">Delete Product</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{showDeleteModal.name}"? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProduct(showDeleteModal._id)}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
