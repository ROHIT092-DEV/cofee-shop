import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import User from '@/models/User'
import Product from '@/models/Product'

export async function POST(request) {
  try {
    await connectDB()
    
    const { items, total, paymentMethod, paymentStatus } = await request.json()
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check stock availability and update inventory
    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.product}` }, { status: 404 })
      }
      
      if (product.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        }, { status: 400 })
      }
      
      // Update stock and sales count
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
          totalSold: item.quantity
        },
        $set: {
          inStock: product.stock - item.quantity > 0
        }
      })
    }

    const order = new Order({
      user: user._id,
      items,
      total,
      status: 'pending',
      paymentMethod: paymentMethod || 'counter',
      paymentStatus: paymentStatus || 'cash'
    })

    await order.save()
    await order.populate('items.product')

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    await connectDB()
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let orders
    if (user.role === 'admin') {
      orders = await Order.find()
        .populate('user', 'name email')
        .populate('items.product')
        .sort({ createdAt: -1 })
    } else {
      orders = await Order.find({ user: user._id })
        .populate('items.product')
        .sort({ createdAt: -1 })
    }

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}