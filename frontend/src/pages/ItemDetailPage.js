import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getItem, getItemReviews, createRent } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { format, differenceInDays } from 'date-fns';
import {
  FaStar, FaMapMarkerAlt, FaStore, FaUser, FaCalendarAlt,
  FaShieldAlt, FaArrowLeft, FaWhatsapp
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './ItemDetail.css';

const UPLOADS_URL = process.env.REACT_APP_UPLOADS_URL || 'http://localhost:5000/uploads';

const Stars = ({ rating }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <FaStar key={s} className={s <= Math.round(rating) ? 'star' : 'star-empty'} />
    ))}
  </div>
);

const ItemDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [booking, setBooking] = useState({ start_date: '', end_date: '', notes: '' });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    Promise.all([getItem(id), getItemReviews(id)])
      .then(([itemRes, reviewsRes]) => {
        setItem(itemRes.data.item);
        setReviews(reviewsRes.data.reviews || []);
      })
      .catch(() => toast.error('Item not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const getImage = (img) =>
    img ? (img.startsWith('http') ? img : `${UPLOADS_URL}/${img}`) : null;

  const totalDays = booking.start_date && booking.end_date
    ? Math.max(0, differenceInDays(new Date(booking.end_date), new Date(booking.start_date)))
    : 0;

  const totalAmount = item ? totalDays * item.price_per_day : 0;

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }
    if (user._id === item.owner_id._id) {
      toast.error("You can't book your own item");
      return;
    }
    if (totalDays < 1) {
      toast.error('Please select valid dates');
      return;
    }
    setBookingLoading(true);
    try {
      await createRent({ item_id: item._id, ...booking });
      toast.success('Booking request sent! 🎉');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!item) return <div className="container"><div className="empty-state"><h3>Item not found</h3></div></div>;

  const images = item.item_images?.length > 0 ? item.item_images : [];
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="item-detail-page">
      <div className="container">
        <Link to="/items" className="back-btn">
          <FaArrowLeft size={12} /> Back to Listings
        </Link>

        <div className="item-detail-grid">
          {/* Images */}
          <div className="item-images-section">
            <div className="item-main-image">
              {images[selectedImage] ? (
                <img src={getImage(images[selectedImage])} alt={item.title} />
              ) : (
                <div className="img-placeholder" style={{ width: '100%', height: '100%', fontSize: '5rem' }}>👗</div>
              )}
              {!item.isAvailable && <div className="unavailable-overlay">Currently Unavailable</div>}
            </div>
            {images.length > 1 && (
              <div className="item-thumbnails">
                {images.map((img, i) => (
                  <button key={i} className={`thumb ${i === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}>
                    <img src={getImage(img)} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="item-info-section">
            <div className="item-detail-header">
              <div>
                <div className="flex-gap mb-1">
                  <span className="badge badge-primary">{item.gender}</span>
                  {item.categories?.map((c) => (
                    <span key={c._id} className="badge badge-gray">{c.category_name}</span>
                  ))}
                </div>
                <h1>{item.title}</h1>
              </div>
              {item.rating > 0 && (
                <div className="item-rating-box">
                  <Stars rating={item.rating} />
                  <span>{Number(item.rating).toFixed(1)} ({item.totalReviews})</span>
                </div>
              )}
            </div>

            <div className="item-price-box">
              <div>
                <span className="item-price">₹{item.price_per_day}</span>
                <span className="item-price-label">/ day</span>
              </div>
              {item.security_deposit > 0 && (
                <div className="flex-gap" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <FaShieldAlt size={12} />
                  <span>Security deposit: ₹{item.security_deposit}</span>
                </div>
              )}
            </div>

            {item.description && (
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 16 }}>
                {item.description}
              </p>
            )}

            {item.size?.length > 0 && (
              <div className="item-sizes">
                <span className="item-detail-label">Available Sizes:</span>
                <div className="size-tags">
                  {item.size.map((s) => (
                    <span key={s} className="size-pill" style={{ fontSize: '0.85rem', padding: '5px 12px' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Owner info */}
            <div className="owner-card">
              {item.shop_id ? (
                <>
                  <FaStore size={14} color="var(--primary)" />
                  <div>
                    <strong>{item.shop_id.shop_name}</strong>
                    <p>{item.shop_id.city}, {item.shop_id.pincode}</p>
                  </div>
                  <Link to={`/shops/${item.shop_id._id}`} className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>
                    View Shop
                  </Link>
                </>
              ) : (
                <>
                  <FaUser size={14} color="var(--primary)" />
                  <div>
                    <strong>{item.owner_id?.name}</strong>
                    <p>Individual Owner · {item.city}</p>
                  </div>
                </>
              )}
            </div>

            {item.city && (
              <div className="flex-gap" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 20 }}>
                <FaMapMarkerAlt size={12} />
                <span>{item.city}{item.pincode ? `, ${item.pincode}` : ''}</span>
              </div>
            )}

            {/* Booking Form */}
            {item.isAvailable ? (
              <form className="booking-form" onSubmit={handleBook}>
                <h3 className="booking-title">Book This Outfit</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input type="date" className="form-control" min={today}
                      value={booking.start_date}
                      onChange={(e) => setBooking((p) => ({ ...p, start_date: e.target.value }))}
                      required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input type="date" className="form-control" min={booking.start_date || today}
                      value={booking.end_date}
                      onChange={(e) => setBooking((p) => ({ ...p, end_date: e.target.value }))}
                      required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes (optional)</label>
                  <textarea className="form-control" rows="2" placeholder="Any special requirements..."
                    value={booking.notes}
                    onChange={(e) => setBooking((p) => ({ ...p, notes: e.target.value }))}
                  />
                </div>

                {totalDays > 0 && (
                  <div className="booking-summary">
                    <div className="booking-summary-row">
                      <span>₹{item.price_per_day} × {totalDays} day{totalDays !== 1 ? 's' : ''}</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    {item.security_deposit > 0 && (
                      <div className="booking-summary-row">
                        <span>Security Deposit</span>
                        <span>₹{item.security_deposit}</span>
                      </div>
                    )}
                    <div className="booking-summary-row total">
                      <strong>Total</strong>
                      <strong>₹{totalAmount + item.security_deposit}</strong>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={bookingLoading || !user}>
                  <FaCalendarAlt />
                  {!user ? 'Login to Book' : bookingLoading ? 'Sending Request...' : 'Send Booking Request'}
                </button>
              </form>
            ) : (
              <div className="alert alert-warning">This item is currently not available for booking.</div>
            )}
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="reviews-section">
            <h2>Reviews ({reviews.length})</h2>
            <div className="reviews-grid">
              {reviews.map((r) => (
                <div key={r._id} className="review-card card card-body">
                  <div className="flex-between mb-1">
                    <strong>{r.reviewer_id?.name}</strong>
                    <Stars rating={r.rating_item} />
                  </div>
                  {r.comment && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{r.comment}</p>}
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: 8 }}>
                    {format(new Date(r.createdAt), 'dd MMM yyyy')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetailPage;
