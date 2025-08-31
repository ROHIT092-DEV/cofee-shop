import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  }],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'counter'],
    default: 'counter',
  },
  paymentStatus: {
    type: String,
    enum: ['cash', 'pending_verification', 'verified', 'rejected'],
    default: 'cash',
  },
}, {
  timestamps: true,
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)