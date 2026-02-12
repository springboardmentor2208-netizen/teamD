import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white pt-10 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>CleanStreet</span>
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Empowering citizens to report issues and improve their community, one street at a time.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-200">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
                            <li><Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link></li>
                            <li><Link to="/report" className="hover:text-blue-400 transition">Report Issue</Link></li>
                            <li><Link to="/complaints" className="hover:text-blue-400 transition">View Complaints</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-200">Resources</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><button className="hover:text-blue-400 transition">Help Center</button></li>
                            <li><button className="hover:text-blue-400 transition">Privacy Policy</button></li>
                            <li><button className="hover:text-blue-400 transition">Terms of Service</button></li>
                            <li><button className="hover:text-blue-400 transition">Contact Support</button></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-200">Contact Us</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                <span>support@cleanstreet.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex gap-4 mt-4">
                                {/* Social Icons Placeholders */}
                                <button className="hover:text-blue-400 transition"><span className="sr-only">Facebook</span>FB</button>
                                <button className="hover:text-blue-400 transition"><span className="sr-only">Twitter</span>TW</button>
                                <button className="hover:text-blue-400 transition"><span className="sr-only">Instagram</span>IG</button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} CleanStreet. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
