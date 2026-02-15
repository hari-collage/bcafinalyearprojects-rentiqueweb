import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaTshirt, FaStore, FaBars, FaTimes, FaUser,
  FaSignOutAlt, FaBoxOpen, FaClipboardList, FaChevronDown, FaTachometerAlt
} from 'react-icons/fa';
import '../../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const isOwner = user && ['shop_owner', 'individual_owner'].includes(user.role);
  const isAdmin = user && user.role === 'admin';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">👗</span>
          <span>Rentique</span>
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`navbar-nav ${menuOpen ? 'open' : ''}`}>
          <li>
            <NavLink to="/items" onClick={() => setMenuOpen(false)}>
              <FaTshirt size={14} /> Browse Outfits
            </NavLink>
          </li>
          <li>
            <NavLink to="/shops" onClick={() => setMenuOpen(false)}>
              <FaStore size={14} /> Shops
            </NavLink>
          </li>
          {user && (
            <>
              <li>
                <NavLink to="/my-bookings" onClick={() => setMenuOpen(false)}>
                  <FaClipboardList size={14} /> My Bookings
                </NavLink>
              </li>
              {isOwner && (
                <li>
                  <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>
                    <FaTachometerAlt size={14} /> Dashboard
                  </NavLink>
                </li>
              )}
            </>
          )}
        </ul>

        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user" ref={dropdownRef} onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="navbar-user-avatar">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="navbar-user-name">{user.name?.split(' ')[0]}</span>
              <FaChevronDown size={10} style={{ color: 'var(--text-muted)', marginLeft: 2 }} />

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={() => { navigate('/profile'); setDropdownOpen(false); }}>
                    <FaUser size={13} /> Profile
                  </button>
                  <button className="dropdown-item" onClick={() => { navigate('/my-bookings'); setDropdownOpen(false); }}>
                    <FaClipboardList size={13} /> My Bookings
                  </button>
                  {isOwner && (
                    <>
                      <button className="dropdown-item" onClick={() => { navigate('/my-listings'); setDropdownOpen(false); }}>
                        <FaBoxOpen size={13} /> My Listings
                      </button>
                      <button className="dropdown-item" onClick={() => { navigate('/dashboard'); setDropdownOpen(false); }}>
                        <FaTachometerAlt size={13} /> Dashboard
                      </button>
                    </>
                  )}
                  {isAdmin && (
                    <button className="dropdown-item" onClick={() => { navigate('/admin'); setDropdownOpen(false); }}>
                      <FaTachometerAlt size={13} /> Admin Panel
                    </button>
                  )}
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <FaSignOutAlt size={13} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
