import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getShops } from '../utils/api';
import { FaSearch, FaStar, FaMapMarkerAlt, FaStore } from 'react-icons/fa';
import './MyBookings.css';

const UPLOADS_URL = process.env.REACT_APP_UPLOADS_URL || 'http://localhost:5000/uploads';

const ShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');

  const fetchShops = useCallback(() => {
    setLoading(true);
    getShops({ search, city })
      .then((r) => setShops(r.data.shops || []))
      .finally(() => setLoading(false));
  }, [search, city]);

  useEffect(() => { fetchShops(); }, [fetchShops]);

  return (
    <div className="container section">
      <div className="page-title">
        <h1>Rental Shops</h1>
        <p>Discover local clothing rental shops near you</p>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        <div className="items-search-input" style={{ flex: 1, minWidth: 200, background: '#fff', border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 14px' }}>
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search shops..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', fontFamily: 'Inter, sans-serif', flex: 1, fontSize: '0.9rem' }} />
        </div>
        <div className="items-search-input" style={{ flex: 1, minWidth: 160, maxWidth: 220, background: '#fff', border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 14px' }}>
          <FaMapMarkerAlt className="search-icon" />
          <input type="text" placeholder="City..." value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ border: 'none', outline: 'none', fontFamily: 'Inter, sans-serif', flex: 1, fontSize: '0.9rem' }} />
        </div>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : shops.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><FaStore /></div>
          <h3>No shops found</h3>
          <p>Try a different city or search term</p>
        </div>
      ) : (
        <div className="shops-grid">
          {shops.map((shop) => {
            const imgSrc = shop.shopImage ? (shop.shopImage.startsWith('http') ? shop.shopImage : `${UPLOADS_URL}/${shop.shopImage}`) : null;
            return (
              <Link key={shop._id} to={`/shops/${shop._id}`} className="shop-card">
                <div className="shop-card-image">
                  {imgSrc ? (
                    <img src={imgSrc} alt={shop.shop_name} />
                  ) : (
                    <div className="shop-card-placeholder">🏪</div>
                  )}
                </div>
                <div className="shop-card-body">
                  <h3 className="shop-card-name">{shop.shop_name}</h3>
                  <div className="shop-card-location">
                    <FaMapMarkerAlt size={11} />
                    <span>{shop.city}, {shop.pincode}</span>
                  </div>
                  {shop.rating > 0 && (
                    <div className="shop-card-rating">
                      <FaStar style={{ color: '#fbbf24' }} size={12} />
                      <span>{Number(shop.rating).toFixed(1)}</span>
                      <span className="text-muted">({shop.totalReviews})</span>
                    </div>
                  )}
                  {shop.description && (
                    <p className="text-muted" style={{ fontSize: '0.82rem', marginTop: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {shop.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShopsPage;
