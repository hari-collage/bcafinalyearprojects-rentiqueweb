const Review = require('../models/Review');
const Rent = require('../models/Rent');
const Item = require('../models/Item');
const User = require('../models/User');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { rent_id, rating_item, rating_owner, comment } = req.body;

    const rent = await Rent.findById(rent_id);
    if (!rent) return res.status(404).json({ success: false, message: 'Rental not found' });
    if (rent.renter_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the renter can review' });
    }
    if (rent.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only review completed rentals' });
    }

    const existing = await Review.findOne({ reviewer_id: req.user._id, rent_id });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this rental' });

    const review = await Review.create({
      reviewer_id: req.user._id,
      item_id: rent.item_id,
      owner_id: rent.owner_id,
      rent_id,
      rating_item,
      rating_owner,
      comment,
    });

    // Update item rating
    const itemReviews = await Review.find({ item_id: rent.item_id });
    const avgItemRating = itemReviews.reduce((sum, r) => sum + r.rating_item, 0) / itemReviews.length;
    await Item.findByIdAndUpdate(rent.item_id, {
      rating: avgItemRating.toFixed(1),
      totalReviews: itemReviews.length,
    });

    res.status(201).json({ success: true, message: 'Review submitted', review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for an item
// @route   GET /api/reviews/item/:itemId
// @access  Public
const getItemReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ item_id: req.params.itemId })
      .populate('reviewer_id', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createReview, getItemReviews };
