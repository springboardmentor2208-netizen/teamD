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
      // Fetch both complaints and volunteers at once
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
      fetchInitialData(); // Refresh list to show updated status/assignment
    } catch (err) {
      alert("Assignment failed");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Assignment Portal</h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-4 border-b">Issue</th>
              <th className="p-4 border-b">Location</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b">Assigned To</th>
              <th className="p-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition">
                <td className="p-4 border-b font-medium">{item.title}</td>
                <td className="p-4 border-b text-sm text-gray-600">{item.address}</td>
                <td className="p-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    item.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 border-b text-sm">
                  {item.assigned_to ? (
                    <span className="text-gray-900 font-semibold">
                      {item.assigned_to.fullName || "Assigned"}
                    </span>
                  ) : (
                    <span className="text-red-500">Unassigned</span>
                  )}
                </td>
                <td className="p-4 border-b">
                  <select
                    className="border rounded p-1 text-sm bg-white"
                    onChange={(e) => handleAssign(item._id, e.target.value)}
                    defaultValue=""
                    disabled={item.status === "resolved"}
                  >
                    <option value="" disabled>Change Volunteer</option>
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
      </div>
    </div>
  );
};

export default AdminPanel;