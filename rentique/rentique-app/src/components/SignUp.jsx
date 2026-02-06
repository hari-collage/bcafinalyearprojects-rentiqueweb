import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api"; // Import API service
// import signupBg from "../assets/signup-bg.jpg";
const signupBg = ""; // Placeholder for missing asset
const cloudinary = require("../config/cloudinary");

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    type: "",
    shopName: "",
    shopAddress: "",
    city: "",
    pincode: "",
    category: "",
    gst: "",
  });

  const [image, setImage] = useState(null); // State for profile image

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.name) newErrors.name = "Full name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.type) newErrors.type = "Select user type";

    // 🏪 Shop owner validation
    if (form.type === "shop") {
      if (!form.shopName) newErrors.shopName = "Shop name is required";
      if (!form.shopAddress) newErrors.shopAddress = "Shop address is required";
      if (!form.city) newErrors.city = "City is required";
      if (!form.pincode) newErrors.pincode = "Pincode is required";
      if (!form.category) newErrors.category = "Select rental category";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("password", form.password);
      formData.append("type", form.type);
      if (image) formData.append("image", image);

      if (form.type === "shop") {
        formData.append("shopName", form.shopName);
        formData.append("shopAddress", form.shopAddress);
        formData.append("city", form.city);
        formData.append("pincode", form.pincode);
        formData.append("category", form.category);
        if (form.gst) formData.append("gst", form.gst);
      }

      try {
        const { data } = await API.post("/auth/signup", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Account created successfully 🎉");
        navigate("/");
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Signup failed");
      }
    }
  };

  return (
    <div className="signup-container">
      <div
        className="signup-image"
        style={{ backgroundImage: `url(${signupBg})` }}
      ></div>

      <div className="signup-form-wrapper">
        <div className="signup-form glass">
          <h1 className="logo">Rentique</h1>
          <h2 className="signup-title">Create Your Account</h2>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input name="name" placeholder="Full Name" onChange={handleChange} />
            {errors.name && <p className="error">{errors.name}</p>}

            <label style={{ display: 'block', margin: '10px 0', color: '#fff' }}>Profile Picture:</label>
            <input type="file" onChange={handleImageChange} accept="image/*" />

            <input name="email" placeholder="Email Address" onChange={handleChange} />
            {errors.email && <p className="error">{errors.email}</p>}

            <input name="phone" placeholder="Phone No" onChange={handleChange} />
            {errors.phone && <p className="error">{errors.phone}</p>}

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}

            {/* User Type */}
            <div className="user-type">
              <p>Select User type:</p>

              <label className="radio-row">
                <input
                  type="radio"
                  name="type"
                  value="customer"
                  onChange={handleChange}
                />
                <span className="custom-radio"></span>
                <span className="radio-text">Customer</span>
              </label>

              <label className="radio-row">
                <input
                  type="radio"
                  name="type"
                  value="shop"
                  onChange={handleChange}
                />
                <span className="custom-radio"></span>
                <span className="radio-text">Shop Owner</span>
              </label>

              {errors.type && <p className="error">{errors.type}</p>}
            </div>

            {/* 🏪 Shop Owner Fields */}
            {form.type === "shop" && (
              <div className="shop-fields">
                <input
                  name="shopName"
                  placeholder="Shop Name"
                  onChange={handleChange}
                />
                {errors.shopName && <p className="error">{errors.shopName}</p>}

                <input
                  name="shopAddress"
                  placeholder="Shop Address"
                  onChange={handleChange}
                />
                {errors.shopAddress && <p className="error">{errors.shopAddress}</p>}

                <input name="city" placeholder="City" onChange={handleChange} />
                {errors.city && <p className="error">{errors.city}</p>}

                <input
                  name="pincode"
                  placeholder="Pincode"
                  onChange={handleChange}
                />
                {errors.pincode && <p className="error">{errors.pincode}</p>}

                <input
                  name="gst"
                  placeholder="GST / License No (optional)"
                  onChange={handleChange}
                />
              </div>
            )}

            <button type="submit">Sign Up</button>
          </form>

          <p className="switch">
            Already have an account?
            <span onClick={() => navigate("/")}> Login</span>
          </p>

          <p className="footer">– Nice to meet up –</p>
        </div>
      </div>
    </div>
  );
}