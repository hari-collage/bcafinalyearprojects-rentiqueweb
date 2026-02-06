const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { upload } = require('../config/cloudinary');

router.post('/signup', upload.single('image'), registerUser);
router.post('/login', loginUser);

module.exports = router;
