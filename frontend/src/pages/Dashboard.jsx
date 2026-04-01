import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import PhotoCarousel from "../components/PhotoCarousel";

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState([
    { label: "Total Issues", value: 0, icon: "📋", color: "text-slate-800", bg: "bg-slate-50" },
    { label: "Assigned", value: 0, icon: "⚡", color: "text-indigo-600", bg: "bg-indigo-50" }, // UPDATED
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

        // UPDATED logic to include 'assigned'
        const counts = {
          total: data.length,
          assigned: data.filter((c) => c.status === "assigned").length,
          inReview: data.filter((c) => c.status === "in_review").length,
          resolved: data.filter((c) => c.status === "resolved").length,
        };

        setStats([
          { label: "Total Reports", value: counts.total, icon: "📋", bg: "bg-slate-100" },
          { label: "Assigned (Auto)", value: counts.assigned, icon: "⚡", bg: "bg-indigo-100" },
          { label: "In Review (Admin)", value: counts.inReview, icon: "🔍", bg: "bg-amber-100" },
          { label: "Resolved", value: counts.resolved, icon: "✨", bg: "bg-emerald-100" },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Helper for Status Badge Colors
  const getStatusColor = (status) => {
    switch (status) {
      case "resolved": return "bg-emerald-500";
      case "in_review": return "bg-amber-500";
      case "assigned": return "bg-indigo-500";
      default: return "bg-blue-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">Securing Data Feed...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-blue-300 to-blue-700 font-sans">
      {/* Header Section */}
      <div className="py-12 mb-8 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-black text-white tracking-tighter italic">
            Welcome, <span className="underline decoration-blue-400">{user ? user.fullName.split(' ')[0] : "User"}</span>
          </h1>
          <p className="text-blue-100 font-bold mt-2 uppercase text-[10px] tracking-[0.3em]">Operational Dashboard // {user?.role} Access</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Modern Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-4 border border-white hover:scale-105 transition-all">
              <div className={`${stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Recent Activity List */}
          <div className="lg:col-span-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-white"></span> Personal Activity Log
            </h2>
            
            <div className="space-y-6">
              {complaints.length > 0 ? (
                complaints.slice(0, 5).map((complaint) => (
                  <div key={complaint._id} className="bg-white rounded-[3rem] p-8 border border-white shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full animate-pulse ${getStatusColor(complaint.status)}`}></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{complaint.zone} Area</span>
                          </div>
                          <span className={`text-[9px] font-black px-4 py-1 rounded-full text-white uppercase tracking-tighter shadow-md ${getStatusColor(complaint.status)}`}>
                            {complaint.status.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors tracking-tight italic">
                          {complaint.title}
                        </h3>
                        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-tighter mb-4 italic">📍 {complaint.address}</p>
                        
                        <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium line-clamp-2 italic">
                          "{complaint.description}"
                        </p>

                        {/* Assigned Volunteer Info */}
                        {complaint.assigned_to && (
                          <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100">
                             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-[10px] font-black">
                               {complaint.assigned_to.fullName?.charAt(0)}
                             </div>
                             <div>
                               <p className="text-[8px] font-black text-slate-400 uppercase">Assigned Officer</p>
                               <p className="text-xs font-black text-slate-800">{complaint.assigned_to.fullName}</p>
                             </div>
                          </div>
                        )}
                      </div>

                      {complaint.photos && complaint.photos.length > 0 && (
                        <div className="w-full md:w-64 h-48 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-inner">
                          <PhotoCarousel photos={complaint.photos} />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/10 backdrop-blur-md rounded-[3rem] p-20 text-center border-4 border-dashed border-white/20">
                  <p className="text-white font-black italic text-sm tracking-widest uppercase opacity-50">Zero Active Reports</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Console</h2>
            
            <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-white/10 relative overflow-hidden">
               <h3 className="text-3xl font-black text-white mb-4 tracking-tighter italic">Found an issue?</h3>
               <p className="text-slate-400 text-xs font-bold mb-8 leading-relaxed">Your report will be automatically geofenced and assigned to the nearest volunteer.</p>
               
               <Link to="/report" className="block w-full bg-blue-600 hover:bg-white hover:text-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] py-5 rounded-[1.5rem] transition-all text-center shadow-xl">
                 Initialize Report
               </Link>
               
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>

            <Link to="/complaints" className="flex items-center justify-between bg-white/95 backdrop-blur-md p-8 rounded-[2.5rem] hover:scale-105 transition-all group shadow-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-blue-600">View Public Feed</span>
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xs group-hover:bg-blue-600 transition-colors">→</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;