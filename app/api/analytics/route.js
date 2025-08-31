import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import User from '@/models/User'

export async function GET(request) {
  try {
    await connectDB()
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const orders = await Order.find({}).populate('items.product', 'name price')
    
    const completedOrders = orders.filter(o => o.status === 'completed')
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0)
    const pendingRevenue = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).reduce((sum, o) => sum + o.total, 0)
    const estimatedProfit = totalRevenue * 0.3
    
    const dailySales = Array.from({length: 7}, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toDateString()
      
      const dayOrders = completedOrders.filter(o => 
        new Date(o.createdAt).toDateString() === dateStr
      )
      
      return {
        date: dateStr,
        revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
        orders: dayOrders.length
      }
    })
    
    const productSales = {}
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        const name = item.product?.name || 'Unknown Product'
        if (!productSales[name]) {
          productSales[name] = { quantity: 0, revenue: 0 }
        }
        productSales[name].quantity += item.quantity
        productSales[name].revenue += item.price * item.quantity
      })
    })
    
    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }))

    return NextResponse.json({
      totalRevenue,
      pendingRevenue,
      estimatedProfit,
      completedOrdersCount: completedOrders.length,
      activeOrdersCount: orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length,
      dailySales,
      topProducts
    })
  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}