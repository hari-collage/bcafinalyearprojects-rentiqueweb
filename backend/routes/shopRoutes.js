// shopRoutes.js
const express = require('express');
const shopRouter = express.Router();
const { createShop, getShops, getShop, updateShop, getMyShop } = require('../controllers/shopController');
const { protect, authorize } = require('../middleware/auth');

shopRouter.get('/', getShops);
shopRouter.get('/my-shop', protect, getMyShop);
shopRouter.get('/:id', getShop);
shopRouter.post('/', protect, authorize('shop_owner', 'admin'), createShop);
shopRouter.put('/:id', protect, updateShop);

module.exports = shopRouter;
