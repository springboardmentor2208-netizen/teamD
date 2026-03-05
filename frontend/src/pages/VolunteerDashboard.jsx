import React, { useState, useEffect } from "react";
import API from "../api/axios";

const VolunteerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [remarks, setRemarks] = useState("");

  const fetchTasks = async () => {
    const res = await API.get("/complaints/volunteer-tasks");
    setTasks(res.data);
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleResolve = async () => {
    try {
      await API.put(`/complaints/${selectedTask._id}/resolve`, { remarks });
      alert("Task Resolved!");
      setSelectedTask(null);
      setRemarks("");
      fetchTasks();
    } catch (err) {
      alert("Error resolving task");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Tasks Assigned to You</h1>
      <div className="grid gap-4">
        {tasks.map(task => (
          <div key={task._id} className="bg-white p-4 rounded shadow flex justify-between">
            <div>
              <h3 className="font-bold">{task.title}</h3>
              <p className="text-sm text-gray-500">{task.address}</p>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                {task.status}
              </span>
            </div>
            <button 
              onClick={() => setSelectedTask(task)}
              className="bg-green-600 text-white px-4 py-2 rounded h-fit"
            >
              Update Status
            </button>
          </div>
        ))}
      </div>

      {/* Resolve Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Resolve: {selectedTask.title}</h2>
            <textarea 
              className="w-full border p-2 mb-4" 
              placeholder="Add your remarks here..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={handleResolve} className="bg-green-600 text-white px-4 py-2 rounded">Mark as Resolved</button>
              <button onClick={() => setSelectedTask(null)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;