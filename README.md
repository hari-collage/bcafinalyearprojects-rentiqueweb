# 👗 Rentique — Location-Based Clothing Rental Marketplace

> **Group No. 6** | Sakshi, Nikita, Harichandra, Alvaz | TYBCA-B | Guide: Prof. Shreesha

A full-stack web application connecting customers with local clothing rental shops and individual owners.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (JSON Web Tokens) |
| File Upload | Multer (local) / Cloudinary (production) |

---

## 📁 Project Structure

```
rentique/
├── backend/               # Node.js + Express API
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── controllers/       # Business logic
│   │   ├── authController.js
│   │   ├── itemController.js
│   │   ├── rentController.js
│   │   ├── shopController.js
│   │   ├── reviewController.js
│   │   └── categoryController.js
│   ├── middleware/
│   │   └── auth.js        # JWT middleware + role-based auth
│   ├── models/            # Mongoose schemas (from ER diagram)
│   │   ├── User.js
│   │   ├── Item.js
│   │   ├── Shop.js
│   │   ├── Rent.js
│   │   ├── Payment.js
│   │   ├── Review.js
│   │   └── Category.js
│   ├── routes/            # Express routes
│   ├── uploads/           # Local image storage
│   ├── .env.example
│   ├── package.json
│   └── server.js          # Main server entry
│
└── frontend/              # React application
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── common/
        │   │   └── PrivateRoute.js
        │   ├── items/
        │   │   ├── ItemCard.js + ItemCard.css
        │   │   └── FilterSidebar.js + FilterSidebar.css
        │   └── layout/
        │       ├── Navbar.js + navbar.css
        │       └── Footer.js
        ├── context/
        │   └── AuthContext.js   # Global auth state
        ├── pages/
        │   ├── Home.js          # Landing page
        │   ├── AuthPages.js     # Login + Register
        │   ├── ItemsPage.js     # Browse with filters
        │   ├── ItemDetailPage.js # Item + Booking form
        │   ├── ShopsPage.js     # All shops
        │   ├── MyBookingsPage.js # Customer bookings
        │   ├── DashboardPage.js  # Owner dashboard
        │   ├── ListItemPage.js   # Add/Edit listing
        │   └── ProfilePage.js    # User profile
        ├── styles/
        │   └── global.css
        ├── utils/
        │   └── api.js           # Axios API calls
        ├── App.js               # Routes
        └── index.js
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

### 1. Clone / Extract the project

```bash
cd rentique
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
```

**Edit `backend/.env`:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/rentique
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

**Start the backend:**
```bash
npm run dev      # Development with nodemon
# OR
npm start        # Production
```

The API will run at `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `frontend/.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_UPLOADS_URL=http://localhost:5000/uploads
```

**Start the frontend:**
```bash
npm start
```

The app will open at `http://localhost:3000`

---

### 4. Seed Initial Data (optional)

After starting the backend, you can create categories via the API or MongoDB Compass:

**Sample categories to add via MongoDB Compass (`rentique` > `categories` collection):**
```json
[
  { "category_name": "Bridal & Wedding" },
  { "category_name": "Party Wear" },
  { "category_name": "Ethnic & Traditional" },
  { "category_name": "Formal & Office" },
  { "category_name": "Casual" },
  { "category_name": "Festive" },
  { "category_name": "Beach & Resort" },
  { "category_name": "Kids Wear" }
]
```

Or use the API endpoint (requires admin token):
```
POST /api/categories
Authorization: Bearer <admin_token>
{ "category_name": "Bridal & Wedding" }
```

---

## 🔐 User Roles

| Role | Can Do |
|------|--------|
| `customer` | Browse, filter, book outfits |
| `individual_owner` | All customer features + list personal clothes |
| `shop_owner` | All individual_owner features + manage a shop |
| `admin` | Full access + category management |

---

## 📡 API Endpoints

### Auth
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| PUT | `/api/auth/profile` | Private |

### Items
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/items` | Public |
| GET | `/api/items/:id` | Public |
| GET | `/api/items/my-listings` | Private |
| POST | `/api/items` | Owner+ |
| PUT | `/api/items/:id` | Owner |
| DELETE | `/api/items/:id` | Owner |

### Shops
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/shops` | Public |
| GET | `/api/shops/:id` | Public |
| GET | `/api/shops/my-shop` | Private |
| POST | `/api/shops` | shop_owner |
| PUT | `/api/shops/:id` | Owner |

### Rentals
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/rents` | Private |
| GET | `/api/rents/my-bookings` | Private |
| GET | `/api/rents/my-requests` | Private |
| GET | `/api/rents/:id` | Private |
| PUT | `/api/rents/:id/status` | Private |

### Reviews & Categories
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/reviews` | Private |
| GET | `/api/reviews/item/:itemId` | Public |
| GET | `/api/categories` | Public |
| POST | `/api/categories` | Admin |

---

## 🗃️ Database Collections (from ER Diagram)

- **users** — user_id, name, email, password, phone_no, role, city, pincode
- **shops** — shop_id, shop_name, owner_id (FK), address, city, pincode
- **items** — item_id, title, price_per_day, security_deposit, gender, size, owner_id (FK), shop_id (FK)
- **rents** — rent_id, item_id (FK), renter_id (FK), owner_id (FK), start_date, end_date, status
- **payments** — payment_id, rental_id (FK), amount, payment_method, payment_status
- **reviews** — reviews_id, reviewer_id (FK), item_id (FK), owner_id (FK), rating_item, rating_owner, comment
- **categories** — category_id, category_name

---

## 🚀 Features Implemented

- ✅ Role-based authentication (JWT)
- ✅ Location-based outfit discovery (city + pincode filter)
- ✅ Flipkart-style multi-filter sidebar (gender, size, price, category)
- ✅ Item listing with image upload
- ✅ Rental booking with date conflict detection
- ✅ Owner dashboard (manage listings + approve/reject requests)
- ✅ Customer booking management (cancel, review)
- ✅ Shop management for shop owners
- ✅ Reviews and rating system
- ✅ Responsive design (mobile-friendly)
- ✅ Toast notifications

---

## 🔮 Future Scope (as per synopsis)

1. **Mobile App** — React Native Android/iOS app
2. **Payment Gateway** — Razorpay/Stripe integration (Payment model is ready)
3. **AI Recommendations** — ML-based outfit suggestions
4. **Real-time Notifications** — Socket.io for booking updates
5. **Map Integration** — Google Maps to show nearby shops

---

## 📋 Team

**Group No. 6 | TYBCA-B**
- Sakshi
- Nikita
- Harichandra
- Alvaz

**Project Guide:** Prof. Shreesha
