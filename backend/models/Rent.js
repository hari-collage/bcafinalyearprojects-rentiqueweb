const mongoose = require('mongoose');

const rentSchema = new mongoose.Schema(
  {
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    renter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    start_date: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    end_date: {
      type: Date,
      required: [true, 'End date is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'active', 'completed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    total_amount: {
      type: Number,
      required: true,
    },
    security_deposit: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rent', rentSchema);
