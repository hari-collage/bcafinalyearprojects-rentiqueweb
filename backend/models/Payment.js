const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    rental_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rent',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    payment_method: {
      type: String,
      enum: ['cash', 'upi', 'card', 'wallet', 'net_banking'],
      required: [true, 'Payment method is required'],
    },
    payment_status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    payment_date: {
      type: Date,
      default: Date.now,
    },
    transaction_id: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
