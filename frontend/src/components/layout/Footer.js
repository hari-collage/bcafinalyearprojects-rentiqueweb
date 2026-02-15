import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTshirt, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

const footerStyle = {
  background: '#1a1a2e',
  color: '#a0aec0',
  padding: '48px 20px 24px',
  marginTop: '60px',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '32px',
  maxWidth: '1200px',
  margin: '0 auto',
  paddingBottom: '32px',
  borderBottom: '1px solid #2d3748',
};

const linkStyle = {
  color: '#a0aec0',
  textDecoration: 'none',
  display: 'block',
  padding: '4px 0',
  fontSize: '0.875rem',
  transition: 'color 0.2s',
};

const Footer = () => (
  <footer style={footerStyle}>
    <div style={gridStyle}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: '1.5rem' }}>👗</span>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>Rentique</span>
        </div>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
          A location-based clothing rental marketplace connecting fashion lovers with local shops and individuals.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          {[FaInstagram, FaTwitter, FaFacebook].map((Icon, i) => (
            <a key={i} href="#" style={{ color: '#a0aec0', fontSize: '1.1rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#7c3aed'}
              onMouseLeave={e => e.target.style.color = '#a0aec0'}>
              <Icon />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 style={{ color: '#fff', marginBottom: 12, fontSize: '0.95rem' }}>Explore</h4>
        {[['Browse Outfits', '/items'], ['Shops Near You', '/shops'], ['How It Works', '/how-it-works']].map(([label, to]) => (
          <Link key={to} to={to} style={linkStyle}
            onMouseEnter={e => e.currentTarget.style.color = '#7c3aed'}
            onMouseLeave={e => e.currentTarget.style.color = '#a0aec0'}>
            {label}
          </Link>
        ))}
      </div>

      <div>
        <h4 style={{ color: '#fff', marginBottom: 12, fontSize: '0.95rem' }}>For Owners</h4>
        {[['List Your Clothes', '/register'], ['Manage Shop', '/dashboard'], ['View Requests', '/dashboard']].map(([label, to]) => (
          <Link key={label} to={to} style={linkStyle}
            onMouseEnter={e => e.currentTarget.style.color = '#7c3aed'}
            onMouseLeave={e => e.currentTarget.style.color = '#a0aec0'}>
            {label}
          </Link>
        ))}
      </div>

      <div>
        <h4 style={{ color: '#fff', marginBottom: 12, fontSize: '0.95rem' }}>Company</h4>
        {[['About Us', '/about'], ['Contact', '/contact'], ['Privacy Policy', '/privacy']].map(([label, to]) => (
          <Link key={to} to={to} style={linkStyle}
            onMouseEnter={e => e.currentTarget.style.color = '#7c3aed'}
            onMouseLeave={e => e.currentTarget.style.color = '#a0aec0'}>
            {label}
          </Link>
        ))}
      </div>
    </div>

    <div style={{ maxWidth: '1200px', margin: '24px auto 0', textAlign: 'center', fontSize: '0.85rem' }}>
      <span>Made with <FaHeart style={{ color: '#ec4899', verticalAlign: 'middle' }} /> by Team Rentique — Sakshi, Nikita, Harichandra, Alvaz</span>
    </div>
  </footer>
);

export default Footer;
