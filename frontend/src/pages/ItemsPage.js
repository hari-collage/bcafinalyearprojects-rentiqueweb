import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getItems, getCategories } from '../utils/api';
import ItemCard from '../components/items/ItemCard';
import FilterSidebar from '../components/items/FilterSidebar';
import { FaSearch, FaSlidersH, FaTimes } from 'react-icons/fa';
import './Items.css';

const sortOptions = [
  { value: 'createdAt', label: 'Latest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const ItemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    pincode: searchParams.get('pincode') || '',
    gender: searchParams.get('gender') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    size: searchParams.get('size') || '',
    sortBy: 'createdAt',
    page: 1,
    limit: 12,
  });

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.categories || []));
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const res = await getItems(params);
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const clearFilters = () => {
    setFilters({
      search: '', city: '', pincode: '', gender: '', category: '',
      minPrice: '', maxPrice: '', size: '', sortBy: 'createdAt', page: 1, limit: 12,
    });
  };

  return (
    <div className="items-page">
      <div className="items-top-bar">
        <div className="container">
          <div className="items-search-bar">
            <div className="items-search-input">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search outfits..."
                value={filters.search}
                onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))}
              />
              {filters.search && (
                <button onClick={() => setFilters((p) => ({ ...p, search: '', page: 1 }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <FaTimes size={12} />
                </button>
              )}
            </div>

            <select className="form-control sort-select"
              value={filters.sortBy}
              onChange={(e) => setFilters((p) => ({ ...p, sortBy: e.target.value, page: 1 }))}>
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <button className="btn btn-outline btn-sm filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
              <FaSlidersH size={13} /> Filters
            </button>
          </div>

          <div className="items-result-info">
            <span>{total} outfit{total !== 1 ? 's' : ''} found</span>
          </div>
        </div>
      </div>

      <div className="container items-layout">
        <div className={`items-sidebar-wrap ${showFilters ? 'show' : ''}`}>
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            onClear={clearFilters}
          />
        </div>

        <div className="items-content">
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👗</div>
              <h3>No outfits found</h3>
              <p>Try changing your filters or search terms</p>
              <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="items-grid">
                {items.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={filters.page <= 1}
                    onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                  >
                    ← Previous
                  </button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`btn btn-sm ${filters.page === p ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setFilters((prev) => ({ ...prev, page: p }))}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={filters.page >= pages}
                    onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemsPage;
