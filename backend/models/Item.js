const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price_per_day: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: [0, 'Price cannot be negative'],
    },
    security_deposit: {
      type: Number,
      default: 0,
      min: [0, 'Security deposit cannot be negative'],
    },
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Unisex', 'Kids'],
      required: [true, 'Gender category is required'],
    },
    size: {
      type: [String],
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
    },
    item_images: {
      type: [String],
      default: [],
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      default: null,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    city: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for filtering
itemSchema.index({ city: 1, pincode: 1, gender: 1, isAvailable: 1 });
itemSchema.index({ categories: 1 });
itemSchema.index({ price_per_day: 1 });

module.exports = mongoose.model('Item', itemSchema);
