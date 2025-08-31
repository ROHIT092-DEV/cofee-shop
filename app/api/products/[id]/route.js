import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

export async function PATCH(request, { params }) {
  try {
    await dbConnect()
    const { stock, inStock } = await request.json()
    
    const updateData = {}
    if (stock !== undefined) updateData.stock = stock
    if (inStock !== undefined) updateData.inStock = inStock
    
    const product = await Product.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    )
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect()
    const { name, description, price, category, stock, isTrending, isFeatured } = await request.json()
    
    const product = await Product.findByIdAndUpdate(
      params.id,
      { name, description, price, category, stock, isTrending, isFeatured },
      { new: true }
    )
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    
    const product = await Product.findByIdAndDelete(params.id)
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}