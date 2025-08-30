import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['coffee', 'tea', 'pastry', 'sandwich'],
  },
  image: {
    type: String,
    default: '/placeholder-coffee.jpg',
  },
  inStock: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)