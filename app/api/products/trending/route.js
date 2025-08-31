import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET() {
  try {
    await dbConnect()
    const trendingProducts = await Product.find({ 
      $or: [
        { isTrending: true },
        { totalSold: { $gte: 5 } }
      ],
      inStock: true,
      stock: { $gt: 0 }
    }).sort({ totalSold: -1 }).limit(6)
    
    return NextResponse.json(trendingProducts)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}