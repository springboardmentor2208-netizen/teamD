import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios"; // Best to use your configured API instance

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

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = phone => phone === "" || /^[6-9]\d{9}$/.test(phone);

  const onSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, location, phoneNumber, role, secretKey } = formData;

    // --- FORM VALIDATION ---
    if (!fullName || !email || !password || !location) {
      alert("Please enter all required fields.");
      return;
    }
    if (!validateEmail(email)) {
      alert("Invalid email format.");
      return;
    }
    if (!validatePhone(phoneNumber)) {
      alert("Invalid phone number (must be 10 digits starting with 6-9).");
      return;
    }
    if (password.length < 6) {
      alert("Security Key (Password) must be at least 6 characters.");
      return;
    }
    if (role === "admin" && secretKey !== "ADMIN123") {
      alert("Invalid Admin System Key.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/register", formData);
      alert("Identity Created Successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white rounded-[3rem] shadow-2xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden border border-slate-100">
        
        {/* LEFT SIDE: BRANDING */}
        <div className="bg-slate-900 md:w-4/12 p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-4 block">
              Join the Network
            </span>
            <h1 className="text-5xl font-black italic tracking-tighter mb-6 leading-none">
              Clean<br/>Street.
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Create your official resident or staff identity to begin reporting and resolving community issues.
            </p>
          </div>
          {/* Decorative Glow */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        {/* RIGHT SIDE: REGISTRATION FORM */}
        <div className="md:w-8/12 p-10 md:p-16 overflow-y-auto max-h-[90vh]">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 italic">
              Create Identity
            </h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
              Initialize your credentials for the portal
            </p>
          </div>

          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
              <input name="fullName" placeholder="Enter your name here..." onChange={handleChange} className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 outline-none" required />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
              <input name="email" type="email" placeholder="Enter your email here..." onChange={handleChange} className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 outline-none" required />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Contact Number</label>
              <input name="phoneNumber" placeholder="(optional)" onChange={handleChange} className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Location/City</label>
              <input name="location" placeholder="Enter your location here..." onChange={handleChange} className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 outline-none" required />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Profile Avatar URL</label>
              <input name="profilePhoto" placeholder="Ex: https://image.link" onChange={handleChange} className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Security Key</label>
              <input type="password" name="password" placeholder="Min. 6 characters" onChange={handleChange} className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 outline-none" required />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Identify As</label>
              <select name="role" onChange={handleChange} className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 appearance-none outline-none cursor-pointer">
                <option value="user">user</option>
                <option value="volunteer">Volunteer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {formData.role === "admin" && (
              <div className="space-y-1 md:col-span-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black uppercase tracking-widest text-red-500 ml-2">Admin System Key</label>
                <input name="secretKey" type="password" placeholder="Enter Restricted Access Key" onChange={handleChange} className="w-full bg-red-50 border-2 border-red-100 p-4 rounded-2xl focus:ring-2 focus:ring-red-500 font-bold text-red-800 outline-none" required />
              </div>
            )}

            <div className="md:col-span-2 pt-4">
              <button disabled={loading} className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] transition-all shadow-xl ${loading ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-1 shadow-blue-200"}`}>
                {loading ? "Initializing..." : "Finalize Registration"}
              </button>
            </div>

          </form>

          <div className="mt-10 text-center border-t border-slate-50 pt-6">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              Already registered? <Link to="/login" className="text-blue-600 hover:underline">Authorize Here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;