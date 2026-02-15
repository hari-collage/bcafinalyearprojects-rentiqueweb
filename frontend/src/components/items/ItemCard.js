import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaTag } from 'react-icons/fa';
import './ItemCard.css';

const UPLOADS_URL = process.env.REACT_APP_UPLOADS_URL || 'http://localhost:5000/uploads';

const ItemCard = ({ item }) => {
  const image = item.item_images?.[0]
    ? (item.item_images[0].startsWith('http') ? item.item_images[0] : `${UPLOADS_URL}/${item.item_images[0]}`)
    : null;

  return (
    <Link to={`/items/${item._id}`} className="item-card">
      <div className="item-card-image">
        {image ? (
          <img src={image} alt={item.title} />
        ) : (
          <div className="img-placeholder item-card-placeholder">👗</div>
        )}
        <div className="item-card-badge">
          <span className="badge badge-primary">{item.gender}</span>
        </div>
        {!item.isAvailable && (
          <div className="item-card-unavailable">Unavailable</div>
        )}
      </div>

      <div className="item-card-body">
        <h3 className="item-card-title">{item.title}</h3>

        <div className="item-card-meta">
          <div className="item-card-rating">
            <FaStar className="star" />
            <span>{item.rating > 0 ? Number(item.rating).toFixed(1) : 'New'}</span>
            {item.totalReviews > 0 && <span className="text-muted">({item.totalReviews})</span>}
          </div>
          {item.city && (
            <div className="item-card-location">
              <FaMapMarkerAlt size={11} />
              <span>{item.city}</span>
            </div>
          )}
        </div>

        {item.categories?.length > 0 && (
          <div className="item-card-categories">
            {item.categories.slice(0, 2).map((cat) => (
              <span key={cat._id} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                {cat.category_name}
              </span>
            ))}
          </div>
        )}

        <div className="item-card-price">
          <span className="price-amount">₹{item.price_per_day}</span>
          <span className="price-label">/ day</span>
          {item.security_deposit > 0 && (
            <span className="price-deposit">+₹{item.security_deposit} deposit</span>
          )}
        </div>

        {item.size?.length > 0 && (
          <div className="item-card-sizes">
            {item.size.slice(0, 4).map((s) => (
              <span key={s} className="size-pill">{s}</span>
            ))}
            {item.size.length > 4 && <span className="size-pill">+{item.size.length - 4}</span>}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ItemCard;
