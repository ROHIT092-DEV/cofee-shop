import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
import Product from '@/models/Product'

export async function GET() {
  try {
    await connectDB()

    const [userCount, orderCount, productCount] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments()
    ])

    return NextResponse.json({
      users: userCount,
      orders: orderCount,
      products: productCount
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}