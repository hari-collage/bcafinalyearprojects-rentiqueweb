const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rent',
      required: true,
    },
    rating_item: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Item rating is required'],
    },
    rating_owner: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Owner rating is required'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

// Ensure one review per rent
reviewSchema.index({ reviewer_id: 1, rent_id: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
