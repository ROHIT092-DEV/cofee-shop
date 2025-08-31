import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const inStock = searchParams.get('inStock')
    
    let query = {}
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (category) {
      query.category = category
    }
    
    if (inStock === 'true') {
      query.stock = { $gt: 0 }
    } else if (inStock !== 'false') {
      query.inStock = true
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const { name, description, price, category, stock = 100, isTrending = false, isFeatured = false } = await request.json()
    const product = await Product.create({ 
      name, 
      description, 
      price, 
      category, 
      stock,
      lowStockThreshold: 10,
      totalSold: 0,
      isTrending,
      isFeatured
    })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}