import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
// You might need to install this: npm install xlsx
import * as XLSX from 'xlsx'; 

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("complaints"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]); 
  const [loading, setLoading] = useState(true);

  // --- NEW: DOWNLOAD FUNCTION ---
  const downloadReport = () => {
    let dataToExport = [];
    let fileName = `CleanStreet_${activeTab}_Report.xlsx`;

    // Format data based on active tab
    if (activeTab === "complaints") {
      dataToExport = complaints.map(c => ({
        Title: c.title,
        Status: c.status,
        Zone: c.zone || "N/A",
        Address: c.address,
        Assigned_To: c.assigned_to?.fullName || "Unassigned",
        Created_At: new Date(c.createdAt).toLocaleDateString()
      }));
    } else if (activeTab === "users") {
      dataToExport = users.map(u => ({
        Name: u.fullName,
        Email: u.email,
        Role: u.role,
        Zone: u.zone || "N/A",
        Active_Tasks: u.activeTasks || 0
      }));
    } else {
      dataToExport = logs.map(l => ({
        Admin: l.admin_id?.fullName || "System",
        Action: l.action,
        Time: new Date(l.timestamp).toLocaleString()
      }));
    }

    // Excel Logic
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, fileName);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [compRes, volRes, userRes, logRes] = await Promise.all([
        API.get("/complaints"), 
        API.get("/admin/volunteers"),
        API.get("/admin/users"),
        API.get("/admin/logs") 
      ]);
      setComplaints(compRes.data || []);
      setVolunteers(volRes.data || []);
      setUsers(userRes.data || []);
      setLogs(logRes.data || []); 
    } catch (err) {
      console.error("Admin Load Error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, userName, newRole) => {
    const confirmChange = window.confirm(`Are you sure you want to change ${userName}'s role to ${newRole.toUpperCase()}?`);
    if (confirmChange) {
      try {
        await API.put(`/admin/users/${userId}/role`, { role: newRole });
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser.id === userId || currentUser._id === userId) {
          alert("Your permissions have changed. Please log in again to update your panel.");
          localStorage.clear(); 
          window.location.href = "/login"; 
          return;
        }
        alert(`Role updated: ${userName} is now a ${newRole}.`);
        fetchInitialData();
      } catch (err) { 
        alert("Role update failed. Please check permissions."); 
      }
    } else {
      fetchInitialData();
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    const firstCheck = window.confirm(`DANGER: Are you sure you want to delete ${userName}?`);
    if (firstCheck) {
      const secondCheck = window.confirm(`This will permanently erase their account and send a notification email. Final confirmation?`);
      if (secondCheck) {
        try {
          await API.delete(`/admin/users/${userId}`);
          alert("User removed and notified.");
          fetchInitialData();
        } catch (err) { alert("Deletion failed."); }
      }
    }
  };

 const handleAssign = async (complaintId, volunteerId) => {
    try {
      // Changed status to 'in_review' to distinguish from 'assigned' (auto)
      await API.put(`/admin/assign/${complaintId}`, { 
        volunteerId, 
        status: "in_review" 
      });
      alert("Admin Manual Assignment Successful!");
      fetchInitialData(); 
    } catch (err) { 
      alert("Assignment failed"); 
    }
  };

  
  // Focused on Intake (Received) and Workload (Assigned)
  const chartData = [
    { 
      name: 'Assigned (Auto)', 
      count: complaints.filter(c => c.status === 'assigned').length, 
      color: '#6366f1' // Indigo
    },
    { 
      name: 'In Review (Admin)', 
      count: complaints.filter(c => c.status === 'in_review').length, 
      color: '#eab308' // Yellow
    },
    { 
      name: 'Resolved', 
      count: complaints.filter(c => c.status === 'resolved').length, 
      color: '#22c55e' // Green
    }
  ];

  const getFilteredData = () => {
    const q = searchQuery.toLowerCase();
    if (activeTab === "complaints") return complaints.filter(c => c.title.toLowerCase().includes(q));
    if (activeTab === "users") return users.filter(u => u.fullName.toLowerCase().includes(q));
    if (activeTab === "logs") return logs.filter(l => l.action.toLowerCase().includes(q));
    return [];
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-blue-600 animate-pulse uppercase tracking-widest">Secure Admin Link...</div>;

  return (
    <div className="min-h-screen bg-[#f9fafb] p-6 md:p-10 font-sans text-gray-900 bg-gradient-to-br from-blue-300 to-blue-700">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter italic text-white">CleanStreet Admin</h1>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              className="bg-white border-2 border-gray-100 rounded-2xl px-6 py-3 text-sm focus:border-black outline-none shadow-sm w-full md:w-80 transition-all font-medium"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* NEW: DOWNLOAD BUTTON */}
            <button 
              onClick={downloadReport}
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-xl whitespace-nowrap"
            >
              <span>📥</span> Export Report
            </button>
          </div>
        </div>

        {/* ... Rest of your component (Stats, Tabs, and Table) remains exactly the same ... */}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
            <h2 className="text-[10px] font-black mb-6 uppercase tracking-widest text-gray-400">Resolution Analytics</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', fontWeight: 'bold'}} />
                  <Bar dataKey="count" radius={[12, 12, 0, 0]} barSize={55}>
                    {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className=" bg-white rounded-[2.5rem] p-9 flex flex-col justify-center shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">
               {activeTab === "logs" ? "Security Audit" : "System Volume"}
            </p>
            <h3 className="text-7xl font-black">
              {activeTab === "logs" ? logs.length : activeTab === "complaints" ? complaints.length : users.length}
            </h3>
            <p className="mt-4 text-[11px] font-bold text-blue-400 uppercase tracking-widest">
              Total {activeTab} Records
            </p>
          </div>
        </div>

        <div className="flex gap-3 mb-8 bg-white p-2 rounded-3xl w-fit shadow-sm border border-gray-50">
          {["complaints", "users", "logs"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-50"}`}
            >
              {tab === "users" ? "Accounts" : tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
              <tr>
                {activeTab === "complaints" && <><th className="p-7">Complaint / Zone</th><th className="p-7">Status</th><th className="p-7">Assigned To</th><th className="p-7 text-center">Update</th></>}
                {activeTab === "users" && <><th className="p-7">Account / Workload</th><th className="p-7">Email / Zone</th><th className="p-7">Access Level</th><th className="p-7 text-center">Actions</th></>}
                {activeTab === "logs" && <><th className="p-7">Admin</th><th className="p-7">Activity Description</th><th className="p-7">Timestamp</th></>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {getFilteredData().map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                  {activeTab === "complaints" && (
                    <>
                      <td className="p-7">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-black text-gray-800 text-sm">{item.title}</p>
                          <span className="text-[8px] bg-slate-900 text-white px-2 py-0.5 rounded-full font-black uppercase">{item.zone || "No Zone"}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">📍 {item.address}</p>
                      </td>
                      <td className="p-7">
                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase border ${item.status === 'resolved' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{item.status}</span>
                      </td>
                      <td className="p-7 text-[11px] font-bold text-gray-500 italic">{item.assigned_to?.fullName || "Awaiting Volunteer"}</td>
                      <td className="p-7 text-center">
                         <select onChange={(e) => handleAssign(item._id, e.target.value)} className="bg-gray-50 border-2 border-gray-100 text-[10px] font-black p-2 rounded-xl outline-none hover:border-blue-400 transition-all" defaultValue="">
                            <option value="" disabled>Manual Assign</option>
                            {volunteers.map(v => <option key={v._id} value={v._id}>{v.fullName} ({v.zone})</option>)}
                         </select>
                      </td>
                    </>
                  )}
                  {activeTab === "users" && (
                    <>
                      <td className="p-7">
                        <p className="font-black text-gray-800 text-sm">{item.fullName}</p>
                        {item.role === 'volunteer' && <p className="text-[9px] font-black text-amber-500 uppercase">🔥 {item.activeTasks || 0} active tasks</p>}
                      </td>
                      <td className="p-7">
                        <p className="text-[11px] font-bold text-gray-400">{item.email}</p>
                        {item.role === 'volunteer' && <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{item.zone || "Not Set"}</p>}
                      </td>
                      <td className="p-7">
                        <select value={item.role} onChange={(e) => handleRoleChange(item._id, item.fullName, e.target.value)} className="text-[10px] font-black bg-white border-2 border-gray-200 rounded-xl px-3 py-1.5 outline-none hover:border-indigo-500 transition-all">
                          <option value="user">User</option>
                          <option value="volunteer">Volunteer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-7 text-center">
                        <button onClick={() => handleDeleteUser(item._id, item.fullName)} className="px-5 py-2.5 bg-gray-50 text-red-500 text-[10px] font-black uppercase rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">Delete</button>
                      </td>
                    </>
                  )}
                  {activeTab === "logs" && (
                    <>
                      <td className="p-7 font-black text-blue-600 text-[11px] uppercase tracking-tighter italic">
                        {item.admin_id?.fullName || "System Admin"}
                      </td>
                      <td className="p-7 font-bold text-gray-700 text-xs">{item.action}</td>
                      <td className="p-7 text-[10px] font-black text-gray-400">
                        {new Date(item.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;