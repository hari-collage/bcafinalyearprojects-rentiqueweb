import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getItems, getCategories } from '../utils/api';
import ItemCard from '../components/items/ItemCard';
import {
  FaSearch, FaMapMarkerAlt, FaTshirt, FaStore, FaStar,
  FaShieldAlt, FaHeart, FaArrowRight, FaLeaf, FaUsers
} from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getItems({ limit: 8, sortBy: 'rating' }),
      getCategories()
    ]).then(([itemsRes, catRes]) => {
      setFeaturedItems(itemsRes.data.items || []);
      setCategories(catRes.data.categories || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (city) params.set('city', city);
    navigate(`/items?${params.toString()}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FaLeaf size={12} /> Sustainable Fashion
          </div>
          <h1 className="hero-title">
            Rent the Perfect Outfit
            <span className="hero-highlight"> Near You</span>
          </h1>
          <p className="hero-subtitle">
            Discover thousands of outfits from local shops and individuals. 
            Rent for any occasion — weddings, parties, travel, and more.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-input">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search outfits, categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="hero-search-city">
              <FaMapMarkerAlt className="search-icon" />
              <input
                type="text"
                placeholder="Your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg hero-search-btn">
              <FaSearch /> Search
            </button>
          </form>

          <div className="hero-stats">
            {[['500+', 'Outfits'], ['50+', 'Shops'], ['1000+', 'Happy Renters']].map(([val, label]) => (
              <div key={label} className="hero-stat">
                <strong>{val}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-cards">
            <div className="hero-float-card card1">
              <span>👗</span> Saree — ₹299/day
            </div>
            <div className="hero-float-card card2">
              <span>🤵</span> Sherwani — ₹599/day
            </div>
            <div className="hero-float-card card3">
              <span>👘</span> Lehenga — ₹799/day
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section home-section">
          <div className="container">
            <div className="section-header">
              <h2>Browse by Category</h2>
              <Link to="/items" className="section-link">View all <FaArrowRight size={12} /></Link>
            </div>
            <div className="categories-grid">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat._id}
                  to={`/items?category=${cat._id}`}
                  className="category-card"
                >
                  <span className="category-icon">👗</span>
                  <span>{cat.category_name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Items */}
      <section className="section home-section" style={{ background: '#f8f4ff' }}>
        <div className="container">
          <div className="section-header">
            <h2>✨ Featured Outfits</h2>
            <Link to="/items" className="section-link">See all <FaArrowRight size={12} /></Link>
          </div>
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : featuredItems.length > 0 ? (
            <div className="items-grid">
              {featuredItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">👗</div>
              <h3>No outfits yet</h3>
              <p>Be the first to list your clothes!</p>
              <Link to="/register" className="btn btn-primary">Start Listing</Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="section home-section">
        <div className="container">
          <h2 className="text-center mb-3">How Rentique Works</h2>
          <div className="how-grid">
            {[
              { icon: '🔍', step: '1', title: 'Browse & Filter', desc: 'Search outfits by location, category, size, and price' },
              { icon: '📅', step: '2', title: 'Book Your Dates', desc: 'Select your rental period and send a booking request' },
              { icon: '✅', step: '3', title: 'Get Confirmed', desc: 'Owner approves your request and you\'re set' },
              { icon: '👗', step: '4', title: 'Wear & Return', desc: 'Enjoy your outfit and return it after your occasion' },
            ].map((item) => (
              <div key={item.step} className="how-card">
                <div className="how-icon">{item.icon}</div>
                <div className="how-step">Step {item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section home-section features-section">
        <div className="container">
          <div className="features-grid">
            {[
              { icon: <FaMapMarkerAlt />, title: 'Location-Based', desc: 'Find rentals near your pincode or city' },
              { icon: <FaShieldAlt />, title: 'Secure Bookings', desc: 'Role-based authentication and secure payments' },
              { icon: <FaHeart />, title: 'Sustainable Fashion', desc: 'Reduce waste by renting instead of buying' },
              { icon: <FaUsers />, title: 'Community', desc: 'Both shops and individuals can list outfits' },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container text-center">
          <h2>Own Clothes? Start Earning!</h2>
          <p>List your outfits and earn money when they're not in use</p>
          <div className="flex-center" style={{ gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              <FaTshirt /> List Your Clothes
            </Link>
            <Link to="/shops" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#fff' }}>
              <FaStore /> Browse Shops
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
