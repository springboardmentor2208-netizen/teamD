import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import PhotoCarousel from "../components/PhotoCarousel";

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState([
    { label: "Total Issues", value: 0, icon: "📋", color: "text-slate-800", bg: "bg-slate-50" },
    { label: "Received", value: 0, icon: "📥", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "In Review", value: 0, icon: "🔍", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Resolved", value: 0, icon: "✨", color: "text-emerald-600", bg: "bg-emerald-50" },
  ]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await API.get("/complaints/my-complaints");
        const data = res.data || [];
        setComplaints(data);

        const counts = {
          total: data.length,
          pending: data.filter((c) => c.status === "received").length,
          inReview: data.filter((c) => c.status === "in_review").length,
          resolved: data.filter((c) => c.status === "resolved").length,
        };

        setStats([
          { label: "Total Issues", value: counts.total, icon: "📋", color: "text-slate-800", bg: "bg-slate-50" },
          { label: "Received", value: counts.pending, icon: "📥", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "In Review", value: counts.inReview, icon: "🔍", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Resolved", value: counts.resolved, icon: "✨", color: "text-emerald-600", bg: "bg-emerald-50" },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  pb-20 bg-gradient-to-br from-blue-300 to-blue-700">
      <div className=" border-b border-slate-200 py-10 mb-8 ">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Welcome back, <span className="text-slate-900">{user ? user.fullName.split(' ')[0] : "User"}</span>
          </h1>
          <p className="text-slate-600 font-medium mt-1">Here is an overview of your community reports.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Statistics Section - Modern Minimalist Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
              <div className={`${stat.bg} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Recent Reports List */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-white rounded-full"></span> Recent Activity
            </h2>
            
            <div className="space-y-4">
              {complaints.length > 0 ? (
                complaints.slice(0, 5).map((complaint) => (
                  <div key={complaint._id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex flex-col gap-6">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className={`w-1 rounded-full ${
                            complaint.status === "resolved" ? "bg-emerald-500" : 
                            complaint.status === "in_review" ? "bg-amber-500" : "bg-blue-500"
                          }`}></div>
                          <div>
                            <h3 className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors">{complaint.title}</h3>
                            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-tighter">📍 {complaint.address}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-black px-3 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-100 uppercase tracking-widest">
                          {complaint.status.replace('_', ' ')}
                        </span>
                      </div>

                      {complaint.photos && complaint.photos.length > 0 && (
                        <div className="rounded-2xl overflow-hidden border border-slate-50 max-w-sm">
                          <PhotoCarousel photos={complaint.photos} />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-[2rem] p-16 text-center border-2 border-dashed border-slate-100">
                  <p className="text-slate-300 font-bold italic text-sm">No issues reported in this cycle.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Actions - Clean & Sharp */}
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Quick Actions</h2>
            <div className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
              <h3 className="text-xl font-bold text-white mb-4 italic relative z-10">New Concern?</h3>
              <p className="text-slate-400 text-sm mb-6 relative z-10">Help improve the community by reporting issues instantly.</p>
              <Link to="/report" className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-2xl transition text-center relative z-10">
                Create Ticket
              </Link>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
            </div>

            <Link to="/complaints" className="flex items-center justify-between bg-white border border-slate-100 p-6 rounded-3xl hover:bg-slate-50 transition-colors group">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-blue-600">All Reports</span>
              <span className="text-xl">➡️</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;