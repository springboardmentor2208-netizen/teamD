import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // If you passed the email via state from ForgotPassword
  const [email] = useState(location.state?.email || ""); 
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/api/auth/reset-password", {
        email,
        otp,
        newPassword
      });
      alert("Success! Please login with your new password.");
      navigate("/login");
    } catch (err) {
      setMsg(err.response?.data?.message || "Reset failed. Check your OTP.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100 px-4">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">Set New Password</h2>
        
        <p className="text-sm text-center text-gray-500">Resetting for: {email}</p>

        <input
          placeholder="Enter 6-digit OTP"
          className="border p-3 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password (min 6 chars)"
          className="border p-3 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded font-bold transition">
          Update Password
        </button>

        {msg && <p className="text-red-500 text-center text-sm font-medium">{msg}</p>}
      </form>
    </div>
  );
}