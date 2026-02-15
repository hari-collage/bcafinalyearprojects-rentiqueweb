const express = require('express');
const router = express.Router();
const { createRent, getMyBookings, getMyRequests, updateRentStatus, getRent } = require('../controllers/rentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createRent);
router.get('/my-bookings', protect, getMyBookings);
router.get('/my-requests', protect, getMyRequests);
router.get('/:id', protect, getRent);
router.put('/:id/status', protect, updateRentStatus);

module.exports = router;
