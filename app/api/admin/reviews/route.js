import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Review from '@/models/Review'
import User from '@/models/User'

export async function GET(request) {
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

    const reviews = await Review.find({})
      .populate('user', 'name')
      .sort({ createdAt: -1 })

    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}