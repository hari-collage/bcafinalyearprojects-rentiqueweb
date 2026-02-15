/**
 * Rentique - Database Seed Script
 * Run: node seed.js
 * Creates demo users and initial categories
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Category = require('./models/Category');
const Shop = require('./models/Shop');
const Item = require('./models/Item');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://rentique:45326712@cluster2.gbciwem.mongodb.net/?appName=Cluster2';

const categories = [
  { category_name: 'Bridal & Wedding' },
  { category_name: 'Party Wear' },
  { category_name: 'Ethnic & Traditional' },
  { category_name: 'Formal & Office' },
  { category_name: 'Casual' },
  { category_name: 'Festive' },
  { category_name: 'Beach & Resort' },
  { category_name: 'Kids Wear' },
  { category_name: 'Indo-Western' },
  { category_name: 'Accessories' },
];

const demoUsers = [
  { name: 'Demo Customer', email: 'customer@demo.com', password: 'demo123', role: 'customer', city: 'Mumbai', pincode: '400001', phone_no: '9876543210' },
  { name: 'Priya Shop Owner', email: 'owner@demo.com', password: 'demo123', role: 'shop_owner', city: 'Mumbai', pincode: '400002', phone_no: '9876543211' },
  { name: 'Rahul Individual', email: 'individual@demo.com', password: 'demo123', role: 'individual_owner', city: 'Pune', pincode: '411001', phone_no: '9876543212' },
  { name: 'Admin User', email: 'admin@rentique.com', password: 'admin123', role: 'admin', city: 'Mumbai', pincode: '400001' },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Shop.deleteMany({}),
      Item.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Seed categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Seed users
    const createdUsers = await User.create(demoUsers);
    console.log(`✅ Created ${createdUsers.length} demo users`);

    const shopOwner = createdUsers.find((u) => u.role === 'shop_owner');
    const individualOwner = createdUsers.find((u) => u.role === 'individual_owner');
    const bridal = createdCategories.find((c) => c.category_name === 'Bridal & Wedding');
    const party = createdCategories.find((c) => c.category_name === 'Party Wear');
    const ethnic = createdCategories.find((c) => c.category_name === 'Ethnic & Traditional');

    // Seed a shop
    const shop = await Shop.create({
      shop_name: "Priya's Bridal Collection",
      owner_id: shopOwner._id,
      address: '14, Fashion Street, Colaba',
      city: 'Mumbai',
      pincode: '400005',
      phone: '9876543211',
      description: 'Premium bridal and occasion wear rentals in South Mumbai',
    });
    console.log('✅ Created demo shop');

    // Seed demo items
    const demoItems = [
      {
        title: 'Red Bridal Lehenga (Designer)',
        description: 'Beautiful red bridal lehenga with heavy embroidery. Perfect for your wedding day.',
        price_per_day: 1499, security_deposit: 5000,
        gender: 'Women', size: ['S', 'M', 'L'],
        categories: [bridal._id, ethnic._id],
        owner_id: shopOwner._id, shop_id: shop._id,
        city: 'Mumbai', pincode: '400005',
      },
      {
        title: 'Navy Blue Sherwani (Groom)',
        description: 'Classic navy blue sherwani with gold embroidery. Includes pagdi.',
        price_per_day: 999, security_deposit: 3000,
        gender: 'Men', size: ['M', 'L', 'XL'],
        categories: [bridal._id, ethnic._id],
        owner_id: shopOwner._id, shop_id: shop._id,
        city: 'Mumbai', pincode: '400005',
      },
      {
        title: 'Black Party Gown',
        description: 'Elegant black floor-length party gown. Ideal for cocktail parties.',
        price_per_day: 599, security_deposit: 1500,
        gender: 'Women', size: ['S', 'M'],
        categories: [party._id],
        owner_id: individualOwner._id,
        city: 'Pune', pincode: '411001',
      },
      {
        title: 'Printed Anarkali Suit',
        description: 'Floral printed anarkali suit with dupatta. Great for festive occasions.',
        price_per_day: 399, security_deposit: 1000,
        gender: 'Women', size: ['S', 'M', 'L', 'XL'],
        categories: [ethnic._id],
        owner_id: individualOwner._id,
        city: 'Pune', pincode: '411001',
      },
      {
        title: 'Kids Kurta Pajama Set',
        description: 'Cute cotton kurta pajama set for festive occasions. Age 5-10 years.',
        price_per_day: 199, security_deposit: 500,
        gender: 'Kids', size: ['Free Size'],
        categories: [ethnic._id],
        owner_id: shopOwner._id, shop_id: shop._id,
        city: 'Mumbai', pincode: '400005',
      },
    ];

    const createdItems = await Item.create(demoItems);
    console.log(`✅ Created ${createdItems.length} demo items`);

    console.log('\n🎉 Seed complete!\n');
    console.log('Demo Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Customer:  customer@demo.com / demo123');
    console.log('Shop Owner: owner@demo.com / demo123');
    console.log('Individual: individual@demo.com / demo123');
    console.log('Admin:     admin@rentique.com / admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
