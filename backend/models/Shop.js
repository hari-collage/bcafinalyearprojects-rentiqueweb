const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    shop_name: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true,
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    shopImage: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Index for location-based queries
shopSchema.index({ city: 1, pincode: 1 });

module.exports = mongoose.model('Shop', shopSchema);
