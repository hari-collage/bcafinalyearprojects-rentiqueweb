import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash, FaTshirt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Auth.css';

export const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const user = await login(form);
      if (['shop_owner', 'individual_owner'].includes(user.role)) {
        navigate('/dashboard');
      } else {
        navigate(from);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo"><FaTshirt /> Rentique</div>
          <h1>Welcome Back!</h1>
          <p>Login to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-control" type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input">
              <input className="form-control" type={showPassword ? 'text' : 'password'} name="password"
                placeholder="••••••••" value={form.password} onChange={handleChange} required />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>

        <div className="auth-demo">
          <p className="text-muted" style={{ fontSize: '0.8rem', textAlign: 'center', marginBottom: 8 }}>
            Demo Accounts:
          </p>
          <div className="demo-accounts">
            <button className="demo-btn" onClick={() => setForm({ email: 'customer@demo.com', password: 'demo123' })}>
              Customer
            </button>
            <button className="demo-btn" onClick={() => setForm({ email: 'owner@demo.com', password: 'demo123' })}>
              Shop Owner
            </button>
          </div>
        </div>
      </div>

      <div className="auth-visual">
        <div className="auth-visual-content">
          <h2>Rent Fashion Near You</h2>
          <p>Access thousands of outfits from local shops and individuals</p>
          <div className="auth-visual-items">
            {['👗 Party Wear', '🤵 Formal', '👘 Traditional', '👙 Beach'].map((item) => (
              <span key={item} className="auth-item-tag">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone_no: '', role: 'customer', city: '', pincode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      const user = await register(data);
      if (['shop_owner', 'individual_owner'].includes(user.role)) {
        navigate('/dashboard');
      } else {
        navigate('/items');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div className="auth-logo"><FaTshirt /> Rentique</div>
          <h1>Create Account</h1>
          <p>Join Rentique today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-control" name="name" placeholder="Your full name"
                value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-control" name="phone_no" placeholder="10-digit number"
                value={form.phone_no} onChange={handleChange} maxLength={10} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input className="form-control" type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className="password-input">
                <input className="form-control" type={showPassword ? 'text' : 'password'} name="password"
                  placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input className="form-control" type="password" name="confirmPassword"
                placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">I want to... *</label>
            <div className="role-selector">
              {[
                { value: 'customer', label: '🛍️ Rent Clothes', desc: 'Browse and book outfits' },
                { value: 'individual_owner', label: '👗 Rent Out My Clothes', desc: 'List personal items' },
                { value: 'shop_owner', label: '🏪 Run a Rental Shop', desc: 'Manage a shop & inventory' },
              ].map((r) => (
                <label key={r.value} className={`role-card ${form.role === r.value ? 'active' : ''}`}>
                  <input type="radio" name="role" value={r.value}
                    checked={form.role === r.value} onChange={handleChange} />
                  <strong>{r.label}</strong>
                  <small>{r.desc}</small>
                </label>
              ))}
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-control" name="city" placeholder="e.g. Mumbai"
                value={form.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input className="form-control" name="pincode" placeholder="6-digit pincode"
                value={form.pincode} onChange={handleChange} maxLength={6} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      <div className="auth-visual">
        <div className="auth-visual-content">
          <h2>Start Your Fashion Journey</h2>
          <p>Join hundreds of shops and individuals already on Rentique</p>
          <div className="auth-visual-items">
            {['💍 Wedding', '🎉 Party', '✈️ Travel', '🏢 Office'].map((item) => (
              <span key={item} className="auth-item-tag">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
