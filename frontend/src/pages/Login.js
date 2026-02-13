import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const body = JSON.stringify({ email, password });

            // Using full URL for backend
            const res = await axios.post('http://localhost:5000/api/auth/login', body, config);
            console.log(res.data);
            localStorage.setItem('user', JSON.stringify(res.data.user)); // Store user data
            setUser(res.data.user); // Update App state
            alert('Login successful!');
            navigate('/'); // Redirect to Home page after login
        } catch (err) {
            console.error(err);
            if (err.response) {
                alert(err.response.data.msg || 'Login Error: Server rejected request');
            } else if (err.request) {
                alert('Network Error: No response from server. Ensure backend is running.');
            } else {
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
          Login to CleanStreet
        </h2>

        <form className="space-y-6" onSubmit={onSubmit}>

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
                bg-white/20
                border border-white/30
                rounded-xl
                text-white
                placeholder-white/60
                backdrop-blur-md
                focus:outline-none
                focus:ring-2
                focus:ring-blue-400
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
              placeholder="Enter your password"
              className="
                mt-1 w-full px-4 py-2
                bg-white/20
                border border-white/30
                rounded-xl
                text-white
                placeholder-white/60
                backdrop-blur-md
                focus:outline-none
                focus:ring-2
                focus:ring-blue-400
                transition
              "
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="
              w-full py-2 px-4
              rounded-xl
              font-medium
              text-white
              bg-blue-500/80
              backdrop-blur-md
              border border-white/20
              hover:bg-blue-600
              transition duration-300
              shadow-lg shadow-blue-900/30
            "
          >
            Login
          </button>

        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <Link
            to="/register"
            className="text-white/70 hover:text-white transition"
          >
            Don't have an account? Register
          </Link>
        </div>

      </div>

    </div>
  </div>
);

};

export default Login;
