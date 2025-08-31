import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema)