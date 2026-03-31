import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from "../api/axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  
  
  const [email] = useState(location.state?.email || ""); 
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword
      });
      alert("Identity Security Updated. Please log in with your new credentials.");
      navigate("/login");
    } catch (err) {
      setMsg(err.response?.data?.message || "Reset failed. Check your OTP and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]  bg-gradient-to-br from-blue-300 to-blue-700 flex items-center justify-center p-6">
      <div className="bg-white rounded-[3rem] shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden border border-slate-100">
        
        {/* LEFT SIDE: SECURITY BRANDING */}
        <div className="bg-slate-900 md:w-5/12 p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-4 block">
              Security Protocol
            </span>
            <h1 className="text-5xl font-black italic tracking-tighter mb-6 leading-none">
              Reset<br/>Access.
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Verify your identity using the 6-digit OTP sent to your registered email address to initialize a new security key.
            </p>
          </div>
          {/* Decorative Glow */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        {/* RIGHT SIDE: RESET FORM */}
        <div className="md:w-7/12 p-10 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 italic">
              Set New Password
            </h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest truncate">
              Updating credentials for: <span className="text-blue-600 lowercase">{email || "unknown@user.com"}</span>
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Verification OTP</label>
              <input
                placeholder="Ex: 123456"
                maxLength="6"
                className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-800 outline-none text-center tracking-[0.5em]"
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">New Security Key</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-800 outline-none"
                onChange={(e) => setNewPassword(e.target.value)}
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
              {loading ? "Verifying..." : "Update Identity Security"}
            </button>

            {msg && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <p className="text-red-500 text-center text-[10px] font-black uppercase tracking-widest">{msg}</p>
              </div>
            )}
          </form>

          <div className="mt-10 text-center md:text-left border-t border-slate-50 pt-8">
            <Link to="/login" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors">
              ← Return to Authorization
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}