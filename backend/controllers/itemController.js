const Item = require('../models/Item');
const Shop = require('../models/Shop');

// @desc    Get all items with filters
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const {
      city, pincode, gender, category, minPrice, maxPrice,
      size, search, page = 1, limit = 12, sortBy = 'createdAt'
    } = req.query;

    const query = { isAvailable: true };

    if (city) query.city = { $regex: city, $options: 'i' };
    if (pincode) query.pincode = pincode;
    if (gender) query.gender = gender;
    if (size) query.size = { $in: [size] };
    if (category) query.categories = category;
    if (minPrice || maxPrice) {
      query.price_per_day = {};
      if (minPrice) query.price_per_day.$gte = Number(minPrice);
      if (maxPrice) query.price_per_day.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = {};
    if (sortBy === 'price_asc') sortOptions.price_per_day = 1;
    else if (sortBy === 'price_desc') sortOptions.price_per_day = -1;
    else if (sortBy === 'rating') sortOptions.rating = -1;
    else sortOptions.createdAt = -1;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate('owner_id', 'name city')
      .populate('shop_id', 'shop_name city')
      .populate('categories', 'category_name')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      items,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner_id', 'name email phone_no city')
      .populate('shop_id', 'shop_name address city pincode phone')
      .populate('categories', 'category_name');

    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create item
// @route   POST /api/items
// @access  Private (shop_owner | individual_owner)
const createItem = async (req, res) => {
  try {
    const { title, description, price_per_day, security_deposit, gender, size, categories, shop_id } = req.body;

    // If individual owner, get city/pincode from user profile
    let city = req.body.city;
    let pincode = req.body.pincode;

    if (shop_id) {
      const shop = await Shop.findById(shop_id);
      if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
      if (shop.owner_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to list items for this shop' });
      }
      city = shop.city;
      pincode = shop.pincode;
    }

    const item_images = req.files ? req.files.map((f) => f.path || f.filename) : [];

    const item = await Item.create({
      title, description, price_per_day, security_deposit, gender,
      size: typeof size === 'string' ? JSON.parse(size) : size,
      categories: typeof categories === 'string' ? JSON.parse(categories) : categories,
      owner_id: req.user._id,
      shop_id: shop_id || null,
      city, pincode, item_images,
    });

    res.status(201).json({ success: true, message: 'Item listed successfully', item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private (owner only)
const updateItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    if (item.owner_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Item updated', item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private (owner only)
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    if (item.owner_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await item.deleteOne();
    res.json({ success: true, message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my listed items
// @route   GET /api/items/my-listings
// @access  Private
const getMyListings = async (req, res) => {
  try {
    const items = await Item.find({ owner_id: req.user._id })
      .populate('categories', 'category_name')
      .populate('shop_id', 'shop_name')
      .sort({ createdAt: -1 });

    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem, getMyListings };
