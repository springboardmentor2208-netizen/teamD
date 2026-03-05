import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import PhotoCarousel from "../components/PhotoCarousel";

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState([
    { label: "Total Issues", value: 0, icon: "⚠️", color: "text-gray-800" },
    { label: "Received", value: 0, icon: "🕒", color: "text-blue-600" },
    { label: "In Review", value: 0, icon: "⚙️", color: "text-yellow-600" },
    { label: "Resolved", value: 0, icon: "✅", color: "text-green-600" },
  ]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await API.get("/complaints/my-complaints");
        const data = res.data;
        setComplaints(data);

        const counts = {
          total: data.length,
          pending: data.filter((c) => c.status === "received").length,
          inReview: data.filter((c) => c.status === "in_review").length,
          resolved: data.filter((c) => c.status === "resolved").length,
        };

        setStats([
          { label: "Total Issues", value: counts.total, icon: "⚠️", color: "text-gray-800" },
          { label: "Received", value: counts.pending, icon: "🕒", color: "text-blue-600" },
          { label: "In Review", value: counts.inReview, icon: "⚙️", color: "text-yellow-600" },
          { label: "Resolved", value: counts.resolved, icon: "✅", color: "text-green-600" },
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
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome, {user ? user.fullName : "User"}
        </h1>

        {/* Statistics Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
                <span className="text-4xl mb-2">{stat.icon}</span>
                <span className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</span>
                <span className="text-gray-500 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Reports List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Recent Reports</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {complaints.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {complaints.slice(0, 5).map((complaint) => (
                    <li key={complaint._id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-4">
                            <span className={`w-3 h-3 rounded-full block mt-2 ${
                              complaint.status === "resolved" ? "bg-green-500" : 
                              complaint.status === "in_review" ? "bg-yellow-500" : "bg-blue-500"
                            }`}></span>
                          </div>
                          <div className="flex-grow">
                            <p className="text-gray-800 font-bold">{complaint.title}</p>
                            <p className="text-gray-500 text-sm">{complaint.address}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 uppercase">
                              {complaint.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Updated Carousel Container: Removed fixed height to allow pagination bar space */}
                        {complaint.photos && complaint.photos.length > 0 && (
                          <div className="mt-2 w-full max-w-md">
                            <PhotoCarousel photos={complaint.photos} />
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-10 text-center text-gray-500">
                  You haven't reported any issues yet.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Actions */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <Link to="/report" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition text-center shadow-sm">
                Report New Issue
              </Link>
              <Link to="/complaints" className="block w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded transition text-center shadow-sm">
                View All Complaints
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;