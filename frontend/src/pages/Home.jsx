import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col bg-[#f8fafc] min-h-screen font-sans">
            
            {/* HERO SECTION - Premium Slate Theme */}
            <header className="bg-slate-950 text-white relative overflow-hidden py-24 lg:py-40 px-6">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-6 animate-in fade-in slide-in-from-bottom-4">
                            Civic Governance & Action
                        </span>
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black italic tracking-tighter mb-8 leading-none">
                            Clean<span className="text-blue-600">Street.</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                            A professional-grade portal for residents to report, track, and resolve community infrastructure issues in real-time.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-md">
                            <Link to="/report" className="bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-[11px] py-5 px-10 rounded-2xl shadow-2xl shadow-blue-900/40 hover:bg-blue-500 hover:-translate-y-1 transition-all text-center">
                                + Initialize Report
                            </Link>
                            <Link to="/complaints" className="bg-slate-900 border border-slate-800 text-slate-300 font-black uppercase tracking-[0.2em] text-[11px] py-5 px-10 rounded-2xl hover:bg-slate-800 transition-all text-center">
                                View Public Feed
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-40 -mt-40"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-900/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
            </header>

            {/* IMPACT STATS - Professional Minimalist */}
            <section className="max-w-7xl mx-auto w-full px-6 -mt-16 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Community Uptime", val: "99.9%", desc: "Reliable reporting" },
                        { label: "Issues Resolved", val: "1.2k+", desc: "Real-world impact" },
                        { label: "Active Volunteers", val: "450+", desc: "Dedicated field staff" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
                            <h3 className="text-4xl font-black italic tracking-tighter text-slate-900 mb-1">{stat.val}</h3>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter">{stat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS - Step Cards */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 block mb-2">Protocol</span>
                        <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter">System Workflow</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Step 1 */}
                        <div className="group">
                            <div className="text-5xl font-black italic text-slate-100 mb-6 group-hover:text-blue-50 transition-colors">01.</div>
                            <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Identify & Capture</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Document civic issues with precise GPS coordinates and visual evidence using our secure reporting tool.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="group">
                            <div className="text-5xl font-black italic text-slate-100 mb-6 group-hover:text-blue-50 transition-colors">02.</div>
                            <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Staff Assignment</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Reports are instantly verified and dispatched to the nearest available volunteer for immediate review.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="group">
                            <div className="text-5xl font-black italic text-slate-100 mb-6 group-hover:text-blue-50 transition-colors">03.</div>
                            <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Resolution Sync</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Track the progress from "Received" to "Resolved" with transparent updates and community feedback.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="bg-white border-y border-slate-100 py-24 px-6 text-center">
                <h2 className="text-3xl font-black text-slate-900 italic tracking-tight mb-8">Ready to transform your neighborhood?</h2>
                <Link to="/register" className="inline-block bg-slate-950 text-white font-black uppercase tracking-[0.2em] text-[10px] py-5 px-12 rounded-2xl hover:bg-slate-800 transition-all shadow-xl">
                    Join CleanStreet Today
                </Link>
            </section>

            {/* FOOTER */}
            <footer className="bg-slate-950 text-slate-500 py-12 px-6 border-t border-slate-900">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <span className="text-white font-black italic text-xl">CleanStreet.</span>
                        <p className="text-[10px] uppercase font-bold tracking-widest mt-2">Professional Governance Portal</p>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest">&copy; {new Date().getFullYear()} All Rights Reserved | Devara Sai Satish</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;