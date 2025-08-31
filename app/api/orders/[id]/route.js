import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import User from '@/models/User'

export async function PATCH(request, { params }) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { status, paymentStatus, paymentMethod } = body
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const updateData = { status }
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod
    
    const order = await Order.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    ).populate('user', 'name email').populate('items.product')

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const order = await Order.findByIdAndDelete(params.id)

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Order deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}