const Shop = require('../models/Shop');
const Item = require('../models/Item');

// @desc    Create a shop
// @route   POST /api/shops
// @access  Private (shop_owner)
const createShop = async (req, res) => {
  try {
    const { shop_name, address, city, pincode, phone, description } = req.body;
    const shopImage = req.file ? req.file.path || req.file.filename : '';

    const shop = await Shop.create({
      shop_name, address, city, pincode, phone, description,
      owner_id: req.user._id,
      shopImage,
    });

    res.status(201).json({ success: true, message: 'Shop created', shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
const getShops = async (req, res) => {
  try {
    const { city, pincode, search, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (city) query.city = { $regex: city, $options: 'i' };
    if (pincode) query.pincode = pincode;
    if (search) query.shop_name = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Shop.countDocuments(query);
    const shops = await Shop.find(query)
      .populate('owner_id', 'name email')
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), shops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single shop with items
// @route   GET /api/shops/:id
// @access  Public
const getShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('owner_id', 'name email phone_no');
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });

    const items = await Item.find({ shop_id: req.params.id, isAvailable: true })
      .populate('categories', 'category_name')
      .limit(12);

    res.json({ success: true, shop, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update shop
// @route   PUT /api/shops/:id
// @access  Private (shop owner)
const updateShop = async (req, res) => {
  try {
    let shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    if (shop.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Shop updated', shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my shop
// @route   GET /api/shops/my-shop
// @access  Private
const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner_id: req.user._id });
    if (!shop) return res.status(404).json({ success: false, message: 'No shop found' });
    res.json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createShop, getShops, getShop, updateShop, getMyShop };
