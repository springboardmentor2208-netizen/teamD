import React, { useState, useEffect } from "react";
import API from "../api/axios";

const VolunteerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/complaints/volunteer-tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!remarks.trim()) return alert("Please add remarks before resolving.");
    
    try {
      await API.put(`/complaints/${selectedTask._id}/resolve`, { remarks });
      alert("Task marked as resolved!");
      setSelectedTask(null);
      setRemarks("");
      fetchMyTasks();
    } catch (err) {
      alert("Failed to update task.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading your tasks...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 bg-gradient-to-br from-blue-100 to-blue-300">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Volunteer Assignments</h1>

      {tasks.length === 0 ? (
        <div className="bg-white p-10 rounded-xl text-center shadow">
          <p className="text-gray-500">No tasks currently assigned to you.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{task.address}</p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">Status: {task.status}</span>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">Reporter: {task.user_id?.fullName}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTask(task)}
                disabled={task.status === "resolved"}
                className={`mt-4 md:mt-0 px-5 py-2 rounded-lg font-semibold transition ${
                  task.status === "resolved" 
                  ? "bg-green-100 text-green-600 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {task.status === "resolved" ? "Completed" : "Action"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Resolution Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-2">Resolve Issue</h2>
            <p className="text-gray-500 text-sm mb-4">Task: {selectedTask.title}</p>
            
            <label className="block text-sm font-medium text-gray-700 mb-2">Resolution Remarks</label>
            <textarea 
              className="w-full border rounded-xl p-3 h-32 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Detail the actions taken to fix this issue..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleResolve}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700"
              >
                Submit & Resolve
              </button>
              <button 
                onClick={() => { setSelectedTask(null); setRemarks(""); }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerTasks;