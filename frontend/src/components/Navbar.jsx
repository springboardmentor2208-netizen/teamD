import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assests/logo.png";

const Navbar = ({ user, onLogout }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to handle image loading errors (Fallback to UI-Avatars)
  const handleImageError = (e) => {
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.fullName || "User"
    )}&background=2563eb&color=fff&bold=true`;
  };

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setProfileOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav ref={navRef} className="sticky top-0 z-[100] bg-slate-950 text-white border-b border-slate-800 shadow-2xl">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 py-5 flex justify-between items-center">

        {/* LEFT: LOGO & NAME */}
        <Link to="/" className="flex items-center gap-4 group flex-shrink-0">
          <div className="w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <img
              src={logo}
              alt="CleanStreet Logo"
              className="w-full h-full object-contain filter drop-shadow-lg"
              onError={(e) => (e.target.style.display = "none")} // Hide if logo file is missing
            />
          </div>
          <span className="font-black italic tracking-tighter text-2xl group-hover:text-blue-400 transition-colors">
            CleanStreet.
          </span>
        </Link>

        {/* CENTER: NAVIGATION */}
        {user && (
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/50 p-1 rounded-2xl border border-slate-800 ml-auto mr-10">
            {[
              { name: "Dashboard", path: "/dashboard" },
              { name: "Report", path: "/report" },
              { name: "Complaints", path: "/complaints" },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActive(link.path) ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {user.role === "volunteer" && (
              <Link
                to="/my-tasks"
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActive("/my-tasks") ? "bg-amber-500 text-black shadow-lg" : "text-amber-500 hover:bg-amber-500/10"
                }`}
              >
                My Tasks
              </Link>
            )}
          </div>
        )}

        {/* RIGHT: AUTH / PROFILE */}
        <div className="flex items-center gap-6 flex-shrink-0 ">
          {!user ? (
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl transition-all hover:-translate-y-1 shadow-blue-900/20">
                Join Now
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 relative">
              {user.role === "admin" && (
                <Link to="/admin-panel" className="hidden xl:flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-red-400">Admin Console</span>
                </Link>
              )}

              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 p-1 rounded-2xl hover:bg-slate-900 transition-all border border-transparent hover:border-slate-800"
              >
                <img
                  src={user?.profilePhoto || user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "User")}&background=2563eb&color=fff&bold=true`}
                  alt="Avatar"
                  className="w-10 h-10 rounded-2xl object-cover border-2 border-slate-800 shadow-lg"
                  onError={handleImageError}
                />
                <div className="hidden md:block text-left">
                  <p className="text-[10px] font-black leading-none mb-1 uppercase tracking-tighter">
                    {user?.fullName?.split(" ")[0] || "User"}
                  </p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                    {user?.role || "Resident"}
                  </p>
                </div>
              </button>

              {/* DROPDOWN MENU */}
              {profileOpen && (
                <div className="absolute right-0 top-16 w-60 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                  <div className="p-5 bg-slate-50 border-b border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated</p>
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button onClick={() => { navigate("/profile"); setProfileOpen(false); }} className="w-full text-left px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all">
                      Account Settings
                    </button>

                    {user.role === "volunteer" && (
                      <button onClick={() => { navigate("/my-tasks"); setProfileOpen(false); }} className="w-full text-left px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-amber-600 hover:bg-amber-50 rounded-xl transition-all">
                        Assigned Tasks
                      </button>
                    )}

                    {user.role === "admin" && (
                      <button onClick={() => { navigate("/admin-panel"); setProfileOpen(false); }} className="w-full text-left px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-red-600 rounded-xl transition-all">
                        Admin Controls
                      </button>
                    )}
                    <div className="h-px bg-slate-100 my-2 mx-5"></div>
                    <button onClick={onLogout} className="w-full text-left px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      End Session
                    </button>
                  </div>
                </div>
              )}

              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-10 h-10 flex items-center justify-center bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-xl font-bold">{menuOpen ? "✕" : "☰"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && user && (
        <div className="md:hidden bg-slate-950 border-t border-slate-900 p-8 space-y-6 animate-in slide-in-from-top-10">
          <div className="flex flex-col gap-4">
            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-xl font-black italic tracking-tighter text-white">Dashboard</Link>
            {user.role === "volunteer" && (
              <Link to="/my-tasks" onClick={() => setMenuOpen(false)} className="text-xl font-black italic tracking-tighter text-amber-500">My Tasks</Link>
            )}
            <Link to="/report" onClick={() => setMenuOpen(false)} className="text-xl font-black italic tracking-tighter text-blue-500">New Report</Link>
            <Link to="/complaints" onClick={() => setMenuOpen(false)} className="text-xl font-black italic tracking-tighter text-white">Public Feed</Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-xl font-black italic tracking-tighter text-slate-500">Settings</Link>
            <button onClick={onLogout} className="text-xl font-black italic tracking-tighter text-red-500 text-left pt-4 border-t border-slate-900">Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;