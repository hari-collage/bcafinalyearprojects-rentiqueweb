const User = require('../models/userModel');
const { cloudinary } = require('../config/cloudinary');

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, type, shopName, shopAddress, city, pincode, category, gst } = req.body;

        if (!name || !email || !password || !phone || !type) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Handle Image Upload
        let profilePic = '';
        if (req.file) {
            // Multer-storage-cloudinary already uploads to Cloudinary, req.file.path is the URL
            profilePic = req.file.path;
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password, // In a real app, hash this password!
            phone,
            type,
            profilePic,
            shopName: type === 'shop' ? shopName : undefined,
            shopAddress: type === 'shop' ? shopAddress : undefined,
            city: type === 'shop' ? city : undefined,
            pincode: type === 'shop' ? pincode : undefined,
            category: type === 'shop' ? category : undefined,
            gst: type === 'shop' ? gst : undefined,
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                type: user.type,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        // Check password (In real app, use bcrypt.compare)
        if (user && user.password === password) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                type: user.type,
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
