import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
// import loginBg from "../assets/login-bg.jpg";
const loginBg = ""; // Placeholder for missing asset
const cloudinary = require("../config/cloudinary");

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const { data } = await API.post("/auth/login", { email, password });
        localStorage.setItem("user", JSON.stringify(data));
        alert("Login successful 🎉");
        navigate("/");
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div
      className="login-bg"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="login-card glass">
        <h1 className="logo">Rentique</h1>
        <h2 className="title">
          <span>WELCOME</span> BACK
        </h2>

        <form className="form" onSubmit={handleSubmit}>
          <input
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <button type="submit">LOGIN</button>
        </form>

        <p className="switch">
          Don’t have an account?
          <span onClick={() => navigate("/signup")}> Sign up</span>
        </p>

        <p className="footer">– Nice to meet up –</p>
      </div>
    </div>
  );
}
