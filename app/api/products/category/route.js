import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    if (!category) {
      return NextResponse.json({ error: 'Category parameter required' }, { status: 400 })
    }
    
    const products = await Product.find({ 
      category,
      inStock: true,
      stock: { $gt: 0 }
    }).sort({ totalSold: -1 })
    
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}