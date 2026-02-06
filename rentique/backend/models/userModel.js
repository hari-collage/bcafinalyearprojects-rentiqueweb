const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        phone: {
            type: String,
            required: [true, 'Please add a phone number'],
        },
        type: {
            type: String,
            enum: ['customer', 'shop'],
            required: [true, 'Please select a user type'],
        },
        profilePic: {
            type: String,
            default: '', // Store Cloudinary URL here
        },
        // Shop Owner Specific Fields
        shopName: { type: String },
        shopAddress: { type: String },
        city: { type: String },
        pincode: { type: String },
        category: { type: String },
        gst: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
