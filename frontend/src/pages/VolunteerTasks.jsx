import React, { useState, useEffect } from "react";
import API from "../api/axios";

const VolunteerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/complaints/volunteer-tasks");
      setTasks(res.data || []);
    } catch (err) {
      console.error("Error fetching tasks", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!remarks.trim()) return alert("Please add professional remarks.");
    
    try {
      setSubmitting(true);
      await API.put(`/complaints/${selectedTask._id}/resolve`, { remarks });
      alert("Task successfully synchronized and resolved!");
      setSelectedTask(null);
      setRemarks("");
      fetchMyTasks();
    } catch (err) {
      alert("Update failed. Check network connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Assignments...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 bg-gradient-to-br from-blue-100 to-blue-300">
      {/* Header */}
      <div className=" border-b border-slate-200 py-10 mb-10">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-end">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 block mb-2">Field Operations</span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">My Assigned Tasks</h1>
          </div>
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block">Active Tickets</span>
            <span className="text-2xl font-black italic">{tasks.filter(t => t.status !== 'resolved').length}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT: TASK FEED */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Incident Queue
          </h2>
          
          {tasks.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-100">
              <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-xs">No active assignments found</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task._id} 
                onClick={() => task.status !== 'resolved' && setSelectedTask(task)}
                className={`bg-white p-8 rounded-[2rem] border transition-all cursor-pointer group ${
                  selectedTask?._id === task._id ? "border-blue-600 ring-2 ring-blue-50" : "border-slate-100 hover:border-slate-300"
                } ${task.status === 'resolved' ? 'opacity-60 grayscale-[0.5]' : ''}`}
              >
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                        task.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">Ticket #{task._id.slice(-6).toUpperCase()}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{task.title}</h3>
                    <p className="text-slate-400 text-sm font-medium mt-1">📍 {task.address}</p>
                  </div>
                  
                  {task.status !== 'resolved' && (
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all font-black">
                      →
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT: ACTION INSPECTOR */}
        <div className="relative">
          <div className="sticky top-32 space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Action Inspector</h2>
            
            {!selectedTask ? (
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white text-center italic shadow-2xl">
                <p className="text-slate-400 text-sm font-medium">Select an active ticket from the queue to start resolution.</p>
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 animate-in slide-in-from-right-5 duration-300">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">Resolving Incident</span>
                <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 mb-6">{selectedTask.title}</h3>
                
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Issue Description</p>
                    <p className="text-xs font-bold text-slate-600 leading-relaxed">{selectedTask.description || "No additional details provided."}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Resolution Remarks</label>
                    <textarea 
                      className="w-full bg-slate-50 border-none p-5 h-40 rounded-3xl focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm text-slate-800"
                      placeholder="Detail your actions here..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleResolve}
                      disabled={submitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:-translate-y-1 transition-all"
                    >
                      {submitting ? "Processing..." : "Complete & Sync"}
                    </button>
                    <button 
                      onClick={() => { setSelectedTask(null); setRemarks(""); }}
                      className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 py-2 transition-colors"
                    >
                      Deselect Task
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerTasks;