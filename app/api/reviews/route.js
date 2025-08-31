import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Review from '@/models/Review'
import User from '@/models/User'

export async function POST(request) {
  try {
    await connectDB()
    
    const { rating, comment } = await request.json()
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user already has a review
    const existingReview = await Review.findOne({ user: user._id })
    if (existingReview) {
      return NextResponse.json({ error: 'You have already submitted a review' }, { status: 400 })
    }

    const review = new Review({
      user: user._id,
      rating,
      comment,
      isApproved: false
    })

    await review.save()
    await review.populate('user', 'name')

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()

    const reviews = await Review.find({ isApproved: true })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10)

    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}