const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/shops', require('./routes/shopRoutes'));
app.use('/api/rents', require('./routes/rentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Rentique API is running 🚀' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Rentique server running on port ${PORT}`);
});
