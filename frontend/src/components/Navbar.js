import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Navbar = ({ user, onLogout }) => {
    const [path,setpath] = useState(null);
    return (
        <nav className="fixed w-full top-0 backdrop-blur-[10px] px-4 py-4 flex items-center z-50">
            <div className="flex-1 flex items-center justify-start">
                <Link onClick={()=>{setpath("/")}} to="/" className="text-xl font-bold text-white-600 flex items-center gap-2">
                    <Logo className="h-8 w-8" />
                    <span className='text-white'>CleanStreet</span>
                </Link>
            </div>

            <div style={{display:user ?'':'none'}} className="md:flex justify-center space-x-8 text-white font-medium">
                <Link onClick={()=>{setpath("/dashboard")}} style={{borderBottom:path==='/dashboard'?"3px solid blue":""}} to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
                <Link onClick={()=>{setpath("/report")}} style={{borderBottom:path==='/report'?"3px solid blue":""}} to="/report" className="hover:text-blue-600">Report Issue</Link>
                <Link onClick={()=>{setpath("/complaints")}} style={{borderBottom:path==='/complaints'?"3px solid blue":""}} to="/complaints" className="hover:text-blue-600">View Complaints</Link>
                <Link onClick={()=>{setpath("/profile")}} style={{borderBottom:path==='/profile'?"3px solid blue":""}} to="/profile" className="hover:text-blue-600">Profile</Link>
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
                        <Link to="/login" className="text-white font-medium hover:text-blue-600 whitespace-nowrap">Login</Link>
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
