import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    password: "",
    role: "user",
    secretKey: "",
    profilePhoto: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = phone =>
    phone === "" || /^[6-9]\d{9}$/.test(phone);

  const onSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, password, location, phoneNumber, role, secretKey } = formData;

    if (!fullName || !email || !password || !location) {
      alert("Please enter all required fields.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Invalid email");
      return;
    }

    if (!validatePhone(phoneNumber)) {
      alert("Invalid phone number");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (role === "admin" && secretKey !== "ADMIN123") {
      alert("Invalid Admin Secret Key");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/auth/register", formData);

      alert("Registration successful!");
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">

          <input name="fullName" placeholder="Full Name" onChange={handleChange} className="w-full border p-2 rounded" required />

          <input name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded" required />

          <input name="phoneNumber" placeholder="Phone (optional)" onChange={handleChange} className="w-full border p-2 rounded" />

          <input name="location" placeholder="Location" onChange={handleChange} className="w-full border p-2 rounded" required />

          <input name="profilePhoto" placeholder="Profile Photo URL (optional)" onChange={handleChange} className="w-full border p-2 rounded" />

          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 rounded" required />

          <select name="role" onChange={handleChange} className="w-full border p-2 rounded">
            <option value="user">User</option>
            <option value="volunteer">Volunteer</option>
            <option value="admin">Admin</option>
          </select>

          {formData.role === "admin" && (
            <input
              name="secretKey"
              type="password"
              placeholder="Admin Secret Key"
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          )}

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Register
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          Already registered?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
