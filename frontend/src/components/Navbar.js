import React from 'react';
import { Link } from 'react-router-dom';

import Logo from './Logo';

const Navbar = ({ user, onLogout }) => {
    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-4 flex items-center">
            <div className="flex-1 flex items-center justify-start">
                <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                    <Logo className="h-8 w-8" />
                    <span>CleanStreet</span>
                </Link>
            </div>

            <div className="hidden md:flex justify-center space-x-8 text-gray-600 font-medium">
                <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
                <Link to="/report" className="hover:text-blue-600">Report Issue</Link>
                <Link to="/complaints" className="hover:text-blue-600">View Complaints</Link>
                <Link to="/profile" className="hover:text-blue-600">Profile</Link>
            </div>

            <div className="flex-1 flex items-center justify-end space-x-4">
                {user ? (
                    <>

                        <button onClick={onLogout} className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition duration-300 whitespace-nowrap">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-700 font-medium hover:text-blue-600 whitespace-nowrap">Login</Link>
                        <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-300 whitespace-nowrap">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
