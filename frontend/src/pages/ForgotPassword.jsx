import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [step,setStep] = useState(1);
  const [email,setEmail] = useState("");
  const [otp,setOtp] = useState("");
  const [password,setPassword] = useState("");

  const [msg,setMsg] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  // SEND OTP
  const sendOTP = async(e)=>{
    e.preventDefault();
    setLoading(true);
    setError("");

    try{
      const res = await axios.post("http://localhost:8000/api/auth/forgot-password",{email});
      setMsg(res.data.message);
      setStep(2);
    }catch(err){
      setError(err.response?.data?.message || "Failed");
    }

    setLoading(false);
  };

  // RESET PASSWORD
  const resetPassword = async(e)=>{
    e.preventDefault();
    setLoading(true);
    setError("");

    try{
      await axios.post("http://localhost:8000/api/auth/reset-password",{
        email,
        otp,
        newPassword: password
      });

      alert("Password updated successfully!");
      navigate("/login");

    }catch(err){
      setError(err.response?.data?.message || "Invalid OTP");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">

      <div className="bg-gray-800 text-white rounded-xl shadow-xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          Forgot Password
        </h2>

        {/* STEP 1 EMAIL */}
        {step===1 && (
          <form onSubmit={sendOTP} className="space-y-4">

            <input
              type="email"
              required
              placeholder="Enter registered email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 focus:outline-none"
            />

            <button className="w-full bg-blue-600 py-2 rounded">
              {loading?"Sending OTP...":"Send OTP"}
            </button>

          </form>
        )}

        {/* STEP 2 OTP + PASSWORD */}
        {step===2 && (
          <form onSubmit={resetPassword} className="space-y-4">

            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={e=>setOtp(e.target.value)}
              className="w-full p-3 rounded bg-gray-700"
            />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              className="w-full p-3 rounded bg-gray-700"
            />

            <button className="w-full bg-green-600 py-2 rounded">
              {loading?"Updating...":"Change Password"}
            </button>

          </form>
        )}

        {msg && <p className="text-green-400 text-center mt-4">{msg}</p>}
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}

        <p className="text-center text-sm mt-6 text-gray-400">
          Remembered password?
          <span
            onClick={()=>navigate("/login")}
            className="text-blue-400 cursor-pointer ml-1"
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
}