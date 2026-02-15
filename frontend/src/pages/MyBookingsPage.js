import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, updateRentStatus } from '../utils/api';
import { format } from 'date-fns';
import { FaCalendarAlt, FaTshirt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './MyBookings.css';

const statusColors = {
  pending: 'badge-warning',
  approved: 'badge-info',
  active: 'badge-success',
  completed: 'badge-gray',
  cancelled: 'badge-danger',
  rejected: 'badge-danger',
};

const UPLOADS_URL = process.env.REACT_APP_UPLOADS_URL || 'http://localhost:5000/uploads';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    getMyBookings()
      .then((res) => setBookings(res.data.rents || []))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await updateRentStatus(id, 'cancelled');
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b))
      );
      toast.success('Booking cancelled');
    } catch {
      toast.error('Could not cancel booking');
    }
  };

  const filteredBookings = activeTab === 'all'
    ? bookings
    : bookings.filter((b) => b.status === activeTab);

  const tabs = [
    { id: 'all', label: 'All', count: bookings.length },
    { id: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: bookings.filter(b => b.status === 'approved').length },
    { id: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
  ];

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="container section">
      <div className="page-title">
        <h1>My Bookings</h1>
        <p>Track your rental requests and bookings</p>
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.count > 0 && <span className="tab-count">{tab.count}</span>}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><FaCalendarAlt /></div>
          <h3>No bookings yet</h3>
          <p>Browse outfits and make your first booking!</p>
          <Link to="/items" className="btn btn-primary">Browse Outfits</Link>
        </div>
      ) : (
        <div className="bookings-list">
          {filteredBookings.map((booking) => {
            const img = booking.item_id?.item_images?.[0];
            const imgSrc = img ? (img.startsWith('http') ? img : `${UPLOADS_URL}/${img}`) : null;

            return (
              <div key={booking._id} className="booking-card card">
                <div className="booking-card-body">
                  <div className="booking-item-img">
                    {imgSrc ? (
                      <img src={imgSrc} alt={booking.item_id?.title} />
                    ) : (
                      <div className="img-placeholder" style={{ width: '100%', height: '100%' }}>👗</div>
                    )}
                  </div>

                  <div className="booking-info">
                    <div className="flex-between mb-1">
                      <h3 className="booking-title">
                        <Link to={`/items/${booking.item_id?._id}`}>
                          {booking.item_id?.title || 'Item Removed'}
                        </Link>
                      </h3>
                      <span className={`badge ${statusColors[booking.status] || 'badge-gray'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    <div className="booking-details">
                      <div className="booking-detail">
                        <FaCalendarAlt size={12} />
                        <span>
                          {format(new Date(booking.start_date), 'dd MMM yyyy')} —{' '}
                          {format(new Date(booking.end_date), 'dd MMM yyyy')}
                        </span>
                      </div>
                      {booking.owner_id?.name && (
                        <div className="booking-detail">
                          <FaTshirt size={12} />
                          <span>Owner: {booking.owner_id.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="booking-footer">
                      <div className="booking-amount">
                        <strong>₹{booking.total_amount}</strong>
                        {booking.security_deposit > 0 && (
                          <span className="text-muted">+₹{booking.security_deposit} deposit</span>
                        )}
                      </div>

                      <div className="booking-actions">
                        <Link to={`/bookings/${booking._id}`} className="btn btn-ghost btn-sm">
                          View Details
                        </Link>
                        {booking.status === 'pending' && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancel(booking._id)}
                          >
                            Cancel
                          </button>
                        )}
                        {booking.status === 'completed' && (
                          <Link to={`/review/${booking._id}`} className="btn btn-primary btn-sm">
                            Write Review
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
