import React, { useState, useEffect } from "react";
import API from "../api/axios";

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [compRes, volRes] = await Promise.all([
        API.get("/complaints"), 
        API.get("/complaints/volunteers")
      ]);
      setComplaints(compRes.data);
      setVolunteers(volRes.data);
    } catch (err) {
      console.error("Error loading admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (complaintId, volunteerId) => {
    if (!volunteerId) return;
    try {
      await API.put(`/complaints/${complaintId}/assign`, { volunteerId });
      alert("Volunteer assigned successfully!");
      fetchInitialData(); 
    } catch (err) {
      alert("Assignment failed");
    }
  };

  
  const downloadReport = () => {
    
    const headers = ["Issue", "Address", "Status", "Reporter", "Assigned Volunteer", "Created At"];
    
   
    const rows = complaints.map(c => [
      `"${c.title}"`,
      `"${c.address}"`,
      c.status.toUpperCase(),
      `"${c.user_id?.fullName || 'N/A'}"`,
      `"${c.assigned_to?.fullName || 'Unassigned'}"`,
      new Date(c.createdAt).toLocaleDateString()
    ]);

   
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Civic_Report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-center mt-10 font-bold text-blue-600">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header with Download Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Admin Assignment Portal</h1>
        <button 
          onClick={downloadReport}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
        >
          📥 Download CSV Report
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-800 text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="p-5">Issue Details</th>
              <th className="p-5">Location</th>
              <th className="p-5">Status</th>
              <th className="p-5">Current Volunteer</th> {/* This is your new column */}
              <th className="p-5 text-center">Re-assign Volunteer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {complaints.map((item) => (
              <tr key={item._id} className="hover:bg-blue-50/50 transition-colors">
                <td className="p-5">
                  <div className="font-bold text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-400">ID: {item._id.slice(-6)}</div>
                </td>
                <td className="p-5 text-sm text-gray-600 italic">{item.address}</td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                    item.status === 'resolved' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : item.status === 'in_review' 
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </td>
                {/* DISPLAY COLUMN */}
                <td className="p-5">
                  {item.assigned_to ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        {item.assigned_to.fullName?.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        {item.assigned_to.fullName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-red-400 bg-red-50 px-2 py-1 rounded">NOT ASSIGNED</span>
                  )}
                </td>
                {/* ACTION COLUMN */}
                <td className="p-5 text-center">
                  <select
                    className="border-2 border-gray-100 rounded-xl p-2 text-xs bg-white outline-none focus:border-blue-500 transition-all font-medium cursor-pointer"
                    onChange={(e) => handleAssign(item._id, e.target.value)}
                    defaultValue=""
                    disabled={item.status === "resolved"}
                  >
                    <option value="" disabled>Choose Volunteer</option>
                    {volunteers.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.fullName}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {complaints.length === 0 && (
          <div className="p-20 text-center text-gray-400 font-medium">No complaints found in the database.</div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;