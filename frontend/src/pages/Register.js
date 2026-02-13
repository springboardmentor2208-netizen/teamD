import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        phoneNumber: '',
        password: ''
    });

    const { fullName, username, email, phoneNumber, password } = formData;
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const body = JSON.stringify({ fullName, username, email, phoneNumber, password });

            // Using full URL for backend
            const res = await axios.post('http://localhost:5000/api/auth/register', body, config);
            console.log(res.data);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            console.error(err);
            if (err.response) {
                // Server responded with a status code outside the 2xx range
                alert(err.response.data.msg || 'Registration Error: Server rejected request');
            } else if (err.request) {
                // The request was made but no response was received
                alert('Network Error: No response from server. Ensure backend is running strictly on port 5000.');
            } else {
                // Something happened in setting up the request that triggered an Error
                alert('Error: ' + err.message);
            }
        }
    };

return (
  <div
    className="
      min-h-screen flex flex-col justify-center items-center px-4
      bg-gradient-to-r
      from-blue-900 via-[#bdb5b5cc] to-indigo-900
      bg-300%
    "
  >
    <div className="w-full max-w-md">

      {/* Glass Card */}
      <div className="
          bg-white/10
          backdrop-blur-2xl
          border border-white/20
          shadow-2xl shadow-black/30
          rounded-2xl
          p-8
      ">

        <h2 className="text-center text-2xl font-bold text-white mb-6">
          Register for CleanStreet
        </h2>

        <form className="space-y-5" onSubmit={onSubmit}>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-white/80">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={fullName}
              onChange={onChange}
              placeholder="Enter your full name"
              className="
                mt-1 w-full px-4 py-2
                bg-white/20 border border-white/30
                rounded-xl text-white
                placeholder-white/60
                backdrop-blur-md
                focus:outline-none focus:ring-2 focus:ring-blue-400
                transition
              "
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-white/80">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={onChange}
              placeholder="Choose a username"
              className="
                mt-1 w-full px-4 py-2
                bg-white/20 border border-white/30
                rounded-xl text-white
                placeholder-white/60
                backdrop-blur-md
                focus:outline-none focus:ring-2 focus:ring-blue-400
                transition
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white/80">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={onChange}
              placeholder="Enter your email"
              className="
                mt-1 w-full px-4 py-2
                bg-white/20 border border-white/30
                rounded-xl text-white
                placeholder-white/60
                backdrop-blur-md
                focus:outline-none focus:ring-2 focus:ring-blue-400
                transition
              "
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-white/80">
              Phone Number <span className="text-white/50">(Optional)</span>
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={onChange}
              placeholder="Enter your phone number"
              className="
                mt-1 w-full px-4 py-2
                bg-white/20 border border-white/30
                rounded-xl text-white
                placeholder-white/60
                backdrop-blur-md
                focus:outline-none focus:ring-2 focus:ring-blue-400
                transition
              "
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-white/80">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={onChange}
              placeholder="Create a password"
              className="
                mt-1 w-full px-4 py-2
                bg-white/20 border border-white/30
                rounded-xl text-white
                placeholder-white/60
                backdrop-blur-md
                focus:outline-none focus:ring-2 focus:ring-blue-400
                transition
              "
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="
              w-full py-2 px-4
              rounded-xl font-medium text-white
              bg-blue-500/80
              backdrop-blur-md
              border border-white/20
              hover:bg-blue-600
              transition duration-300
              shadow-lg shadow-blue-900/30
            "
          >
            Register
          </button>

        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-white/70 hover:text-white transition"
          >
            Already have an account? Login
          </Link>
        </div>

      </div>

    </div>
  </div>
);

};

export default Register;
