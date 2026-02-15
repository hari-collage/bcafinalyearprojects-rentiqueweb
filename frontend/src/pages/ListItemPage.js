import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createItem, updateItem, getItem, getCategories, getMyShop } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaUpload, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './ListItem.css';

const GENDERS = ['Men', 'Women', 'Unisex', 'Kids'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

const ListItemPage = () => {
  const { id } = useParams(); // for edit mode
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', description: '', price_per_day: '', security_deposit: '',
    gender: 'Women', size: [], categories: [], city: user?.city || '',
    pincode: user?.pincode || '', shop_id: '',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [myShop, setMyShop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data.categories || []));
    if (user.role === 'shop_owner') {
      getMyShop().then((r) => setMyShop(r.data.shop)).catch(() => {});
    }
    if (isEdit) {
      getItem(id)
        .then((r) => {
          const item = r.data.item;
          setForm({
            title: item.title, description: item.description || '',
            price_per_day: item.price_per_day, security_deposit: item.security_deposit || '',
            gender: item.gender, size: item.size || [],
            categories: item.categories?.map((c) => c._id) || [],
            city: item.city || '', pincode: item.pincode || '',
            shop_id: item.shop_id?._id || '',
          });
        })
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEdit, user.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggleSize = (s) => {
    setForm((p) => ({
      ...p,
      size: p.size.includes(s) ? p.size.filter((x) => x !== s) : [...p.size, s],
    }));
  };

  const toggleCategory = (catId) => {
    setForm((p) => ({
      ...p,
      categories: p.categories.includes(catId)
        ? p.categories.filter((x) => x !== catId)
        : [...p.categories, catId],
    }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files].slice(0, 5));
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...previews].slice(0, 5));
  };

  const removeImage = (idx) => {
    setImages((p) => p.filter((_, i) => i !== idx));
    setImagePreviews((p) => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price_per_day || !form.gender) {
      toast.error('Please fill required fields');
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await updateItem(id, form);
        toast.success('Listing updated!');
        navigate(`/items/${id}`);
      } else {
        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => {
          if (Array.isArray(v)) formData.append(k, JSON.stringify(v));
          else if (v) formData.append(k, v);
        });
        images.forEach((img) => formData.append('images', img));
        await createItem(formData);
        toast.success('Item listed successfully! 🎉');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save listing');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="container section">
      <div className="page-title">
        <h1>{isEdit ? 'Edit Listing' : 'List an Outfit'}</h1>
        <p>{isEdit ? 'Update your listing details' : 'Share your clothes with the community'}</p>
      </div>

      <div className="list-item-grid">
        <form className="list-item-form card card-body" onSubmit={handleSubmit}>
          {/* Basic Info */}
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Basic Information</h3>

          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-control" name="title" placeholder="e.g. Designer Bridal Lehenga"
              value={form.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" name="description" rows="3"
              placeholder="Describe the outfit, condition, occasion it's suitable for..."
              value={form.description} onChange={handleChange} />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Price per Day (₹) *</label>
              <input className="form-control" type="number" name="price_per_day" min="0"
                placeholder="e.g. 299" value={form.price_per_day} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Security Deposit (₹)</label>
              <input className="form-control" type="number" name="security_deposit" min="0"
                placeholder="Optional deposit" value={form.security_deposit} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Gender *</label>
            <div className="gender-options">
              {GENDERS.map((g) => (
                <label key={g} className={`gender-btn ${form.gender === g ? 'active' : ''}`}>
                  <input type="radio" name="gender" value={g} checked={form.gender === g}
                    onChange={handleChange} />
                  {g}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Available Sizes</label>
            <div className="size-multi-grid">
              {SIZES.map((s) => (
                <button key={s} type="button"
                  className={`size-btn ${form.size.includes(s) ? 'active' : ''}`}
                  onClick={() => toggleSize(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Categories</label>
            <div className="categories-multi">
              {categories.map((c) => (
                <label key={c._id} className={`cat-tag ${form.categories.includes(c._id) ? 'active' : ''}`}>
                  <input type="checkbox" checked={form.categories.includes(c._id)}
                    onChange={() => toggleCategory(c._id)} />
                  {c.category_name}
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="divider" />
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Location</h3>

          {myShop && (
            <div className="form-group">
              <label className="form-label">List under shop?</label>
              <select className="form-control" name="shop_id" value={form.shop_id} onChange={handleChange}>
                <option value="">Individual Listing</option>
                <option value={myShop._id}>{myShop.shop_name}</option>
              </select>
            </div>
          )}

          {!form.shop_id && (
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-control" name="city" placeholder="e.g. Mumbai"
                  value={form.city} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input className="form-control" name="pincode" placeholder="6-digit code"
                  value={form.pincode} onChange={handleChange} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Listing' : 'Publish Listing'}
            </button>
            <button type="button" className="btn btn-ghost btn-lg" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>

        {/* Image Upload */}
        {!isEdit && (
          <div className="image-upload-section">
            <div className="card card-body">
              <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Photos (up to 5)</h3>
              <label className="upload-area">
                <FaUpload size={24} style={{ color: 'var(--primary)', marginBottom: 8 }} />
                <p>Click or drag photos here</p>
                <span className="text-muted">JPG, PNG, WebP · Max 5MB each</span>
                <input type="file" multiple accept="image/*" onChange={handleImages} style={{ display: 'none' }} />
              </label>

              <div className="image-previews">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="preview-item">
                    <img src={src} alt="" />
                    <button type="button" className="remove-img" onClick={() => removeImage(i)}>
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListItemPage;
