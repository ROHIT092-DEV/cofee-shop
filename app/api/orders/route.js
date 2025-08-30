import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import User from '@/models/User'

export async function POST(request) {
  try {
    await connectDB()
    
    const { items, total } = await request.json()
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const order = new Order({
      user: user._id,
      items,
      total,
      status: 'pending'
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