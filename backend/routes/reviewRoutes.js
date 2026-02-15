// reviewRoutes.js
const express = require('express');
const reviewRouter = express.Router();
const { createReview, getItemReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

reviewRouter.post('/', protect, createReview);
reviewRouter.get('/item/:itemId', getItemReviews);

module.exports = reviewRouter;
