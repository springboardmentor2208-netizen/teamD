import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                    {/* Placeholder for logo icon if needed */}
                    <span>CleanStreet</span>
                </Link>
            </div>

            <div className="hidden md:flex space-x-8 text-gray-600 font-medium">
                <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
                <Link to="/report" className="hover:text-blue-600">Report Issue</Link>
                <Link to="/complaints" className="hover:text-blue-600">View Complaints</Link>
                <Link to="/profile" className="hover:text-blue-600">Profile</Link>
            </div>

            <div className="flex items-center space-x-4">
                {user ? (
                    <>
                        <span className="text-gray-700 font-medium">Welcome, {user.username}</span>
                        <button onClick={onLogout} className="text-gray-700 font-medium hover:text-red-600">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-700 font-medium hover:text-blue-600">Login</Link>
                        <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-300">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
