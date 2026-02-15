import React from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import './FilterSidebar.css';

const genders = ['Men', 'Women', 'Unisex', 'Kids'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

const FilterSidebar = ({ filters, setFilters, categories, onClear }) => {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const hasFilters = filters.gender || filters.category || filters.minPrice ||
    filters.maxPrice || filters.size || filters.pincode;

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <div className="flex-gap">
          <FaFilter size={14} color="var(--primary)" />
          <span>Filters</span>
        </div>
        {hasFilters && (
          <button className="filter-clear-btn" onClick={onClear}>
            <FaTimes size={12} /> Clear All
          </button>
        )}
      </div>

      {/* Location */}
      <div className="filter-section">
        <h4 className="filter-section-title">Location</h4>
        <input
          className="form-control"
          placeholder="City (e.g. Mumbai)"
          value={filters.city || ''}
          onChange={(e) => handleChange('city', e.target.value)}
        />
        <input
          className="form-control"
          style={{ marginTop: 8 }}
          placeholder="Pincode"
          value={filters.pincode || ''}
          onChange={(e) => handleChange('pincode', e.target.value)}
        />
      </div>

      {/* Category */}
      <div className="filter-section">
        <h4 className="filter-section-title">Category</h4>
        <div className="filter-options">
          <label className={`filter-option ${!filters.category ? 'active' : ''}`}>
            <input type="radio" name="category" value="" checked={!filters.category}
              onChange={() => handleChange('category', '')} />
            All Categories
          </label>
          {categories.map((cat) => (
            <label key={cat._id} className={`filter-option ${filters.category === cat._id ? 'active' : ''}`}>
              <input type="radio" name="category" value={cat._id}
                checked={filters.category === cat._id}
                onChange={() => handleChange('category', cat._id)} />
              {cat.category_name}
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div className="filter-section">
        <h4 className="filter-section-title">Gender</h4>
        <div className="filter-options">
          <label className={`filter-option ${!filters.gender ? 'active' : ''}`}>
            <input type="radio" name="gender" value="" checked={!filters.gender}
              onChange={() => handleChange('gender', '')} />
            All
          </label>
          {genders.map((g) => (
            <label key={g} className={`filter-option ${filters.gender === g ? 'active' : ''}`}>
              <input type="radio" name="gender" value={g}
                checked={filters.gender === g}
                onChange={() => handleChange('gender', g)} />
              {g}
            </label>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="filter-section">
        <h4 className="filter-section-title">Size</h4>
        <div className="size-grid">
          {sizes.map((s) => (
            <button
              key={s}
              className={`size-btn ${filters.size === s ? 'active' : ''}`}
              onClick={() => handleChange('size', filters.size === s ? '' : s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <h4 className="filter-section-title">Price Per Day (₹)</h4>
        <div className="price-range">
          <input
            type="number"
            className="form-control"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value)}
          />
          <span style={{ color: 'var(--text-muted)' }}>—</span>
          <input
            type="number"
            className="form-control"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
          />
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
