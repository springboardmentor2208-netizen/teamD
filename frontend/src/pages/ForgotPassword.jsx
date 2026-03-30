import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // STEP 1: SEND OTP
  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");

    try {
      const res = await API.post("/auth/forgot-password", { email });
      setMsg(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Check email.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: RESET PASSWORD
  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });

      alert("Security Credentials Updated! Redirecting to Authorization...");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white rounded-[3rem] shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden border border-slate-100">
        
        {/* LEFT SIDE: SECURITY BRANDING */}
        <div className="bg-slate-900 md:w-5/12 p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-4 block">
              Identity Recovery
            </span>
            <h1 className="text-5xl font-black italic tracking-tighter mb-6 leading-none">
              Account<br/>Safety.
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              {step === 1 
                ? "Enter your registered email to receive a one-time verification code to recover your CleanStreet account."
                : "A 6-digit code has been dispatched. Enter it below along with your new security key to regain access."}
            </p>
          </div>
          {/* Decorative Glow */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        {/* RIGHT SIDE: INTERACTIVE FORM */}
        <div className="md:w-7/12 p-10 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 italic">
              {step === 1 ? "Forgot Password?" : "Reset Access"}
            </h2>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
              {step === 1 ? "Step 01: Verify Identity" : "Step 02: Update Credentials"}
            </p>
          </div>

          {/* STEP 1: EMAIL REQUEST */}
          {step === 1 && (
            <form onSubmit={sendOTP} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Registered Email</label>
                <input
                  type="email"
                  required
                  placeholder="resident@cleanstreet.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-800 outline-none"
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
                {loading ? "Requesting OTP..." : "Send Verification Code"}
              </button>
            </form>
          )}

          {/* STEP 2: OTP & NEW PASSWORD */}
          {step === 2 && (
            <form onSubmit={resetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Verification Code</label>
                <input
                  placeholder="Ex: 123456"
                  maxLength="6"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-800 outline-none text-center tracking-[0.5em]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">New Security Key</label>
                <input
                  type="password"
                  required
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-800 outline-none"
                />
              </div>

              <button
                disabled={loading}
                className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] transition-all shadow-xl ${
                  loading 
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
                    : "bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-1 shadow-emerald-200"
                }`}
              >
                {loading ? "Synchronizing..." : "Update Credentials"}
              </button>
            </form>
          )}

          {/* MESSAGES */}
          {(msg || error) && (
            <div className={`mt-6 p-4 rounded-2xl border text-center animate-in fade-in slide-in-from-top-2 ${
              error ? "bg-red-50 border-red-100 text-red-500" : "bg-emerald-50 border-emerald-100 text-emerald-600"
            }`}>
              <p className="text-[10px] font-black uppercase tracking-widest">{error || msg}</p>
            </div>
          )}

          <div className="mt-10 text-center md:text-left border-t border-slate-50 pt-8">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              Back to Authorization?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign In Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}