import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6 bg-gradient-to-br from-blue-300 to-blue-700">
      <div className="bg-white rounded-[3rem] shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden border border-slate-100">
        
        {/* LEFT SIDE: BRANDING PANEL */}
        <div className="bg-slate-900 md:w-5/12 p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-4 block">
              Civic Action Portal
            </span>
            <h1 className="text-5xl font-black italic tracking-tighter mb-6 leading-none">
              Clean<br/>Street.
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[200px]">
              Empowering residents to build safer, cleaner, and better neighborhoods together.
            </p>
          </div>
          
          {/* Decorative Glow */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        {/* RIGHT SIDE: AUTHENTICATION FORM */}
        <div className="md:w-7/12 p-10 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 italic">
              Authorize Access
            </h2>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
              Identify yourself to enter the dashboard
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Identity</label>
              <input
                name="email"
                type="email"
                placeholder="Ex: resident@cleanstreet.com"
                onChange={handleChange}
                className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-800 outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                <Link to="/forgot-password" size="sm" className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700">
                  Recovery?
                </Link>
              </div>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-800 outline-none"
                required
              />
            </div>

            <button
              disabled={loading}
              className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] transition-all shadow-xl ${
                loading 
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-1 shadow-blue-200"
              }`}
            >
              {loading ? "Verifying..." : "Initialize Session"}
            </button>
          </form>

          <div className="mt-10 text-center md:text-left border-t border-slate-50 pt-8">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              New to the platform?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;