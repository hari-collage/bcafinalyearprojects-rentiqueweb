const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const {
  getItems, getItem, createItem, updateItem, deleteItem, getMyListings
} = require('../controllers/itemController');
const { protect, authorize } = require('../middleware/auth');

// Multer config with Cloudinary storage
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/', getItems);
router.get('/my-listings', protect, getMyListings);
router.get('/:id', getItem);
router.post(
  '/',
  protect,
  authorize('shop_owner', 'individual_owner', 'admin'),
  upload.array('images', 5),
  createItem
);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;
