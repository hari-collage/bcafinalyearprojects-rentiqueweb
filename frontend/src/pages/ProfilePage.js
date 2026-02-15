import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../utils/api';
import toast from 'react-hot-toast';
import { FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope, FaEdit, FaSave } from 'react-icons/fa';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone_no: user?.phone_no || '',
    city: user?.city || '',
    pincode: user?.pincode || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(form);
      updateUser(res.data.user);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const roleLabels = {
    customer: '🛍️ Customer',
    shop_owner: '🏪 Shop Owner',
    individual_owner: '👗 Individual Owner',
    admin: '⚙️ Admin',
  };

  return (
    <div className="container section">
      <div className="page-title">
        <h1>My Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div style={{ maxWidth: 600 }}>
        <div className="card card-body">
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '1.8rem', fontWeight: 700,
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ marginBottom: 4 }}>{user?.name}</h2>
              <span className="badge badge-primary">{roleLabels[user?.role]}</span>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label"><FaUser size={12} /> Full Name</label>
                <input className="form-control" name="name" value={form.name}
                  onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label"><FaPhone size={12} /> Phone Number</label>
                <input className="form-control" name="phone_no" value={form.phone_no}
                  onChange={handleChange} maxLength={10} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label"><FaMapMarkerAlt size={12} /> City</label>
                  <input className="form-control" name="city" value={form.city} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input className="form-control" name="pincode" value={form.pincode} onChange={handleChange} maxLength={6} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <FaSave size={12} /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              {[
                { icon: <FaEnvelope size={14} />, label: 'Email', value: user?.email },
                { icon: <FaPhone size={14} />, label: 'Phone', value: user?.phone_no || 'Not added' },
                { icon: <FaMapMarkerAlt size={14} />, label: 'City', value: user?.city || 'Not added' },
                { icon: null, label: 'Pincode', value: user?.pincode || 'Not added' },
              ].map((field) => (
                <div key={field.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 32, color: 'var(--primary)' }}>{field.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{field.label}</div>
                    <div style={{ fontWeight: 500, marginTop: 2 }}>{field.value}</div>
                  </div>
                </div>
              ))}

              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setEditing(true)}>
                <FaEdit size={12} /> Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
