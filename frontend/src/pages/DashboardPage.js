import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyListings, getMyRequests, updateRentStatus, deleteItem } from '../utils/api';
import { format } from 'date-fns';
import {
  FaBoxOpen, FaClipboardList, FaPlus, FaEdit, FaTrash,
  FaCheck, FaTimes, FaTachometerAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './MyBookings.css';

const UPLOADS_URL = process.env.REACT_APP_UPLOADS_URL || 'http://localhost:5000/uploads';

const statusColors = {
  pending: 'badge-warning',
  approved: 'badge-info',
  active: 'badge-success',
  completed: 'badge-gray',
  cancelled: 'badge-danger',
  rejected: 'badge-danger',
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyListings(), getMyRequests()])
      .then(([listRes, reqRes]) => {
        setListings(listRes.data.items || []);
        setRequests(reqRes.data.rents || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateRentStatus(id, status);
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
      toast.success(`Request ${status}`);
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await deleteItem(id);
      setListings((prev) => prev.filter((l) => l._id !== id));
      toast.success('Listing deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const totalEarnings = requests
    .filter((r) => r.status === 'completed')
    .reduce((sum, r) => sum + r.total_amount, 0);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <FaTachometerAlt size={14} /> },
    { id: 'listings', label: `My Listings (${listings.length})`, icon: <FaBoxOpen size={14} /> },
    { id: 'requests', label: `Requests (${pendingRequests.length})`, icon: <FaClipboardList size={14} /> },
  ];

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="container section">
      <div className="page-title">
        <h1>Owner Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>

      <div className="dashboard-grid">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          {navItems.map((n) => (
            <button
              key={n.id}
              className={`dashboard-nav-item ${activeTab === n.id ? 'active' : ''}`}
              onClick={() => setActiveTab(n.id)}
            >
              {n.icon} {n.label}
            </button>
          ))}
          <div className="divider" />
          <Link to="/list-item" className="btn btn-primary btn-full btn-sm">
            <FaPlus size={12} /> Add New Listing
          </Link>
        </aside>

        {/* Content */}
        <div>
          {activeTab === 'overview' && (
            <div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{listings.length}</div>
                  <div className="stat-label">Total Listings</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{pendingRequests.length}</div>
                  <div className="stat-label">Pending Requests</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">₹{totalEarnings}</div>
                  <div className="stat-label">Total Earnings</div>
                </div>
              </div>

              {/* Recent Requests */}
              {requests.slice(0, 5).length > 0 && (
                <div>
                  <h3 style={{ marginBottom: 16 }}>Recent Requests</h3>
                  <div className="bookings-list">
                    {requests.slice(0, 5).map((req) => (
                      <RequestCard key={req._id} req={req} onStatusUpdate={handleStatusUpdate} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'listings' && (
            <div>
              <div className="flex-between mb-2">
                <h3>My Listings ({listings.length})</h3>
                <Link to="/list-item" className="btn btn-primary btn-sm">
                  <FaPlus size={12} /> Add Listing
                </Link>
              </div>

              {listings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">👗</div>
                  <h3>No listings yet</h3>
                  <p>Start by adding your first outfit!</p>
                  <Link to="/list-item" className="btn btn-primary">Add Listing</Link>
                </div>
              ) : (
                <div className="listings-table">
                  {listings.map((item) => {
                    const img = item.item_images?.[0];
                    const imgSrc = img ? (img.startsWith('http') ? img : `${UPLOADS_URL}/${img}`) : null;
                    return (
                      <div key={item._id} className="listing-row card">
                        <div className="listing-row-body">
                          <div className="listing-img">
                            {imgSrc ? (
                              <img src={imgSrc} alt={item.title} />
                            ) : (
                              <div className="img-placeholder" style={{ width: '100%', height: '100%' }}>👗</div>
                            )}
                          </div>
                          <div className="listing-info">
                            <h4>{item.title}</h4>
                            <p className="text-muted">₹{item.price_per_day}/day · {item.gender}</p>
                            <span className={`badge ${item.isAvailable ? 'badge-success' : 'badge-gray'}`}>
                              {item.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                          <div className="listing-actions">
                            <Link to={`/items/${item._id}`} className="btn btn-ghost btn-sm">View</Link>
                            <Link to={`/edit-item/${item._id}`} className="btn btn-outline btn-sm">
                              <FaEdit size={11} /> Edit
                            </Link>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(item._id)}>
                              <FaTrash size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div>
              <h3 style={{ marginBottom: 16 }}>Rental Requests ({requests.length})</h3>
              {requests.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <h3>No requests yet</h3>
                  <p>Requests from customers will appear here</p>
                </div>
              ) : (
                <div className="bookings-list">
                  {requests.map((req) => (
                    <RequestCard key={req._id} req={req} onStatusUpdate={handleStatusUpdate} showActions />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RequestCard = ({ req, onStatusUpdate, showActions = true }) => {
  const img = req.item_id?.item_images?.[0];
  const imgSrc = img ? (img.startsWith('http') ? img : `${UPLOADS_URL}/${img}`) : null;

  return (
    <div className="booking-card card">
      <div className="booking-card-body">
        <div className="booking-item-img">
          {imgSrc ? <img src={imgSrc} alt={req.item_id?.title} /> : <div className="img-placeholder" style={{ width: '100%', height: '100%' }}>👗</div>}
        </div>
        <div className="booking-info">
          <div className="flex-between mb-1">
            <h3 className="booking-title" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {req.item_id?.title}
            </h3>
            <span className={`badge ${statusColors[req.status] || 'badge-gray'}`}>
              {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            By: <strong>{req.renter_id?.name}</strong> · {req.renter_id?.phone_no || req.renter_id?.email}
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {format(new Date(req.start_date), 'dd MMM')} — {format(new Date(req.end_date), 'dd MMM yyyy')} · ₹{req.total_amount}
          </p>

          {showActions && req.status === 'pending' && (
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button className="btn btn-success btn-sm" onClick={() => onStatusUpdate(req._id, 'approved')}>
                <FaCheck size={11} /> Approve
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => onStatusUpdate(req._id, 'rejected')}>
                <FaTimes size={11} /> Reject
              </button>
            </div>
          )}
          {showActions && req.status === 'approved' && (
            <button className="btn btn-primary btn-sm" style={{ marginTop: 10 }}
              onClick={() => onStatusUpdate(req._id, 'completed')}>
              Mark Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
