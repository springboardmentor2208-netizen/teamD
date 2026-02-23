import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/forgot-password",
        { email }
      );

      setMessage(res.data.message);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center">

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition hover:scale-105">

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot Password 🔐
        </h2>

        <p className="text-gray-500 text-sm text-center mb-6">
          Enter your registered email. We will send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        
        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded text-center">
            ✅ {message}
            <p className="text-xs mt-1">
              Redirecting to login...
            </p>
          </div>
        )}

        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-600 rounded text-center">
            ❌ {error}
          </div>
        )}

      </div>

    </div>
  );
}