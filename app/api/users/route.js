import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
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

    const users = await User.find({}).select('-password').sort({ createdAt: -1 })

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}