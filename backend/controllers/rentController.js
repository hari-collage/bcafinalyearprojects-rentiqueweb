const Rent = require('../models/Rent');
const Item = require('../models/Item');
const Payment = require('../models/Payment');

// @desc    Create a rental booking
// @route   POST /api/rents
// @access  Private (customer)
const createRent = async (req, res) => {
  try {
    const { item_id, start_date, end_date, notes } = req.body;

    const item = await Item.findById(item_id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (!item.isAvailable) return res.status(400).json({ success: false, message: 'Item is not available' });

    // Calculate total amount
    const start = new Date(start_date);
    const end = new Date(end_date);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days < 1) return res.status(400).json({ success: false, message: 'Invalid rental period' });

    const total_amount = days * item.price_per_day;
    const security_deposit = item.security_deposit;

    // Check for date conflicts
    const conflict = await Rent.findOne({
      item_id,
      status: { $in: ['approved', 'active'] },
      $or: [
        { start_date: { $lte: end }, end_date: { $gte: start } },
      ],
    });
    if (conflict) return res.status(400).json({ success: false, message: 'Item is already booked for these dates' });

    const rent = await Rent.create({
      item_id,
      renter_id: req.user._id,
      owner_id: item.owner_id,
      start_date: start,
      end_date: end,
      total_amount,
      security_deposit,
      notes,
    });

    await rent.populate([
      { path: 'item_id', select: 'title item_images price_per_day' },
      { path: 'owner_id', select: 'name email phone_no' },
    ]);

    res.status(201).json({ success: true, message: 'Booking request sent', rent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my bookings (as renter)
// @route   GET /api/rents/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const rents = await Rent.find({ renter_id: req.user._id })
      .populate('item_id', 'title item_images price_per_day city')
      .populate('owner_id', 'name phone_no')
      .sort({ createdAt: -1 });

    res.json({ success: true, rents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get requests for my items (as owner)
// @route   GET /api/rents/my-requests
// @access  Private
const getMyRequests = async (req, res) => {
  try {
    const rents = await Rent.find({ owner_id: req.user._id })
      .populate('item_id', 'title item_images')
      .populate('renter_id', 'name email phone_no city')
      .sort({ createdAt: -1 });

    res.json({ success: true, rents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update rental status
// @route   PUT /api/rents/:id/status
// @access  Private
const updateRentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const rent = await Rent.findById(req.params.id);
    if (!rent) return res.status(404).json({ success: false, message: 'Rental not found' });

    // Owner can approve/reject/complete
    if (['approved', 'rejected', 'completed'].includes(status)) {
      if (rent.owner_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Only the owner can update this status' });
      }
    }
    // Renter can cancel
    if (status === 'cancelled') {
      if (rent.renter_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Only the renter can cancel' });
      }
    }

    rent.status = status;
    await rent.save();

    res.json({ success: true, message: `Rental ${status}`, rent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single rental
// @route   GET /api/rents/:id
// @access  Private
const getRent = async (req, res) => {
  try {
    const rent = await Rent.findById(req.params.id)
      .populate('item_id', 'title item_images price_per_day security_deposit')
      .populate('renter_id', 'name email phone_no city')
      .populate('owner_id', 'name email phone_no');

    if (!rent) return res.status(404).json({ success: false, message: 'Rental not found' });

    const authorized =
      rent.renter_id._id.toString() === req.user._id.toString() ||
      rent.owner_id._id.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!authorized) return res.status(403).json({ success: false, message: 'Not authorized' });

    res.json({ success: true, rent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createRent, getMyBookings, getMyRequests, updateRentStatus, getRent };
