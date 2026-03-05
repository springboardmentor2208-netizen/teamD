import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assests/logo.png";

const Navbar = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navRef = useRef();
  const navigate = useNavigate();


  useEffect(() => {
    const handler = e => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav ref={navRef} className="sticky top-0 z-50 bg-gray-900 text-white shadow">

      <div className="w-full px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="CleanStreet Logo"
            className="w-9 h-9 rounded-full border transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-bold hidden sm:block">CleanStreet</span>
        </Link>

        {/* Desktop Links */}
        {user && (
          <div className="hidden md:flex gap-6 text-gray-300 font-medium">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/report">Report</Link>
            <Link to="/complaints">Complaints</Link>
            {user?.role === "volunteer" && (
              <Link to="/my-tasks" className="text-blue-600 font-bold underline">
                My Tasks
              </Link>
            )}
            {user.role === "admin" && <Link to="/admin-panel">Admin</Link>}
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {!user && (
            <>
              <Link to="/login" className="bg-blue-600 px-4 py-2 rounded">Login</Link>
              <Link to="/register" className="bg-blue-600 px-4 py-2 rounded">
                Register
              </Link>
            </>
          )}

          {user && (
            <div className="relative">

              {/* Avatar */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2"
              >
                <img
                  src={user.profilePhoto || "https://i.pravatar.cc/40"}
                  alt="User avatar"
                  className="w-9 h-9 rounded-full border"
                />
                <span className="hidden md:block">{user.fullName}</span>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white text-gray-800 rounded-xl shadow-xl border overflow-hidden animate-fade">

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 transition"
                  >
                    👤 Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 transition"
                  >
                    📊 Dashboard
                  </button>

                  {user.role === "admin" && (
                    <button
                      onClick={() => {
                        navigate("/admin");
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 transition"
                    >
                      🛠 Admin Panel
                    </button>
                  )}

                  <div className="border-t">

                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition"
                    >
                      🚪 Logout
                    </button>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* Hamburger */}
          {user && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1"
            >
              <span className={`h-0.5 w-6 bg-white transition ${menuOpen && "rotate-45 translate-y-2"}`} />
              <span className={`h-0.5 w-6 bg-white transition ${menuOpen && "opacity-0"}`} />
              <span className={`h-0.5 w-6 bg-white transition ${menuOpen && "-rotate-45 -translate-y-2"}`} />
            </button>
          )}

        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && user && (
        <div className="md:hidden bg-gray-800 px-6 py-4 space-y-3">

          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/report" onClick={() => setMenuOpen(false)}>Report</Link>
          <Link to="/complaints" onClick={() => setMenuOpen(false)}>Complaints</Link>
          <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>

          {user.role === "admin" && (
            <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
          )}

        </div>
      )}

    </nav>
  );
};

export default Navbar;
