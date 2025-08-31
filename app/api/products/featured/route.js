import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET() {
  try {
    await connectDB()
    const featuredProducts = await Product.find({ 
      isFeatured: true,
      inStock: true,
      stock: { $gt: 0 }
    }).sort({ createdAt: -1 }).limit(4)
    
    return NextResponse.json(featuredProducts)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}