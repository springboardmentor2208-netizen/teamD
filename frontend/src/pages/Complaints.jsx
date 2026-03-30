import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import API from "../api/axios";
import PhotoCarousel from "../components/PhotoCarousel";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet Icon Fixes
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, 15);
  return null;
};

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [sortOrder, setSortOrder] = useState("newest");
  const [commentText, setCommentText] = useState({});
  const [selectedPhotos, setSelectedPhotos] = useState(null);
  const [mapCenter, setMapCenter] = useState([17.385, 78.486]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchComplaints();
  }, [sortOrder]);

  // Combined Filtering Logic: Search + Status
  useEffect(() => {
    let results = complaints.filter(c => 
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== "all") {
      results = results.filter(c => c.status === statusFilter);
    }

    setFilteredComplaints(results);
  }, [searchTerm, statusFilter, complaints]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch (err) { 
      console.error("Fetch error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const showOnMap = (coords) => {
    if (coords?.lat && coords?.lng) {
      setMapCenter([coords.lat, coords.lng]);
      setViewMode("map");
    }
  };

  const handleVote = async (complaintId, type) => {
    try {
      await API.post(`/votes/${complaintId}`, { vote_type: type });
      await fetchComplaints(); 
    } catch (err) { alert(err.response?.data?.message || "Voting failed"); }
  };

  const handleDeleteComplaint = async (id) => {
    if (!window.confirm("Delete this complaint permanently?")) return;
    try {
      await API.delete(`/complaints/${id}`);
      fetchComplaints();
    } catch (err) { alert("Failed to delete complaint"); }
  };

  const handleComment = async (complaintId) => {
    if (!commentText[complaintId]) return;
    try {
      await API.post("/comments", { complaint_id: complaintId, content: commentText[complaintId] });
      setCommentText({ ...commentText, [complaintId]: "" });
      fetchComplaints(); 
    } catch (err) { alert("Failed to post comment"); }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await API.delete(`/complaints/comment/${commentId}`); 
      fetchComplaints(); 
    } catch (err) { alert("Could not delete comment"); }
  };

  const checkOwnership = (itemUserId) => {
    if (!currentUser || !itemUserId) return false;
    const targetId = typeof itemUserId === 'object' ? (itemUserId._id || itemUserId.id) : itemUserId;
    const currentId = currentUser._id || currentUser.id;
    return String(targetId) === String(currentId);
  };

  // Helper for Status Badge Colors
  const getStatusStyle = (status) => {
    switch(status) {
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-blue-600">Updating Feed...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-700 py-10 px-4 md:px-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Advanced Controls */}
        <div className="flex flex-col space-y-6 mb-10">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Civic Feed</h1>
            <div className="hidden md:block text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
              Showing {filteredComplaints.length} reports
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              type="text" 
              placeholder="Search title or area..." 
              className="md:col-span-2 px-5 py-3 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select 
              className="px-4 py-3 border-none rounded-2xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 shadow-md font-bold text-gray-700 cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="received">Received</option>
              <option value="in_review">In Review</option>
              <option value="resolved">Resolved</option>
            </select>

            <div className="flex bg-white rounded-2xl p-1 shadow-md">
              <button onClick={() => setViewMode("list")} className={`flex-1 py-2 text-sm font-black rounded-xl transition-all ${viewMode === "list" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400"}`}>List</button>
              <button onClick={() => setViewMode("map")} className={`flex-1 py-2 text-sm font-black rounded-xl transition-all ${viewMode === "map" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400"}`}>Map</button>
            </div>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredComplaints.map((c) => {
              const isMyComplaint = checkOwnership(c.user_id);
              return (
                <div key={c._id} className={`group bg-white rounded-[2rem] shadow-xl flex flex-col h-full overflow-hidden transition-all hover:-translate-y-2 relative border-4 ${isMyComplaint ? "border-slate-700" : "border-transparent"}`}>
                  
                  {isMyComplaint && (
                    <button onClick={() => handleDeleteComplaint(c._id)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}

                  <div className="p-7 flex-grow">
                    {isMyComplaint && <span className="inline-block bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-lg mb-3 tracking-widest uppercase shadow-sm">Your Report</span>}
                    
                    <h2 className="font-extrabold text-gray-800 text-xl mb-2 line-clamp-1">{c.title}</h2>
                    
                    <div className="flex items-center gap-2 mb-5">
                      <span className={`text-[10px] font-bold uppercase border px-3 py-1 rounded-full ${getStatusStyle(c.status)}`}>{c.status}</span>
                      <button onClick={() => showOnMap(c.location_coords)} className="text-[11px] text-gray-400 hover:text-blue-600 transition-colors font-medium truncate max-w-[150px]">📍 {c.address}</button>
                    </div>

                    <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-3">"{c.description}"</p>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <button onClick={() => handleVote(c._id, "upvote")} className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-2xl font-black text-sm hover:bg-green-100 transition-all active:scale-90">👍 {c.upvotes || 0}</button>
                      <button onClick={() => handleVote(c._id, "downvote")} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-2xl font-black text-sm hover:bg-red-100 transition-all active:scale-90">👎 {c.downvotes || 0}</button>
                    </div>

                    {c.photos?.length > 0 && (
                      <button onClick={() => setSelectedPhotos(c.photos)} className="w-full py-3 bg-gray-50 text-blue-600 text-xs font-bold rounded-2xl hover:bg-blue-50 transition-colors mb-6 flex justify-center items-center gap-2 border border-blue-100">
                        📸 View Evidence ({c.photos.length})
                      </button>
                    )}

                    <div className="bg-gray-50 rounded-[1.5rem] p-4 max-h-40 overflow-y-auto text-xs space-y-3 border border-gray-100 shadow-inner">
                      <p className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">Discussion</p>
                      {c.comments?.map((com) => (
                        <div key={com._id} className="flex justify-between items-start group/comment">
                          <p className="flex-1 text-gray-600 leading-relaxed">
                            <span className="font-black text-blue-600 mr-2">{checkOwnership(com.user_id) ? "You" : (com.user_id?.fullName || "User")}:</span> 
                            {com.content}
                          </p>
                          {checkOwnership(com.user_id) && (
                            <button onClick={() => deleteComment(com._id)} className="text-red-300 hover:text-red-600 font-bold ml-2">✕</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 border-t bg-white">
                      <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Join discussion..." 
                            className="flex-1 text-xs bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={commentText[c._id] || ""}
                            onChange={(e) => setCommentText({...commentText, [c._id]: e.target.value})}
                          />
                          <button onClick={() => handleComment(c._id)} className="bg-blue-600 text-white text-xs px-5 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all">Post</button>
                      </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-[700px] w-full rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl relative">
            <MapContainer center={mapCenter} zoom={12} className="h-full w-full">
              <ChangeView center={mapCenter} />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {filteredComplaints.map((c) => (
                c.location_coords && (
                  <Marker key={c._id} position={[c.location_coords.lat, c.location_coords.lng]}>
                    <Popup maxWidth={300} className="custom-popup">
                      <div className="p-2 w-full min-w-[220px]">
                        {checkOwnership(c.user_id) && <span className="bg-blue-600 text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase block mb-2 w-fit">Your Report</span>}
                        <h3 className="font-black text-gray-800 text-sm mb-3">{c.title}</h3>
                        <div className="flex gap-4 mb-4 border-b border-gray-100 pb-3">
                           <button onClick={() => handleVote(c._id, "upvote")} className="text-green-600 text-xs font-bold">👍 {c.upvotes || 0}</button>
                           <button onClick={() => handleVote(c._id, "downvote")} className="text-red-600 text-xs font-bold">👎 {c.downvotes || 0}</button>
                           {c.photos?.length > 0 && <button onClick={() => setSelectedPhotos(c.photos)} className="text-blue-600 text-[10px] font-bold underline ml-auto">Evidence</button>}
                        </div>
                        <div className="max-h-24 overflow-y-auto mb-3 text-[10px] space-y-2">
                           {c.comments?.map((com) => (
                             <div key={com._id} className="flex justify-between items-start">
                               <p className="flex-1"><span className="font-bold text-blue-600">{checkOwnership(com.user_id) ? "You" : (com.user_id?.fullName || "User")}:</span> {com.content}</p>
                               {checkOwnership(com.user_id) && <button onClick={() => deleteComment(com._id)} className="text-red-500 font-bold ml-1">✕</button>}
                             </div>
                           ))}
                        </div>
                        <div className="flex gap-1 pt-2 border-t">
                           <input type="text" placeholder="Comment..." className="flex-1 text-[10px] bg-gray-50 border-none rounded-lg px-2 py-2 outline-none" value={commentText[c._id] || ""} onChange={(e) => setCommentText({...commentText, [c._id]: e.target.value})} />
                           <button onClick={() => handleComment(c._id)} className="bg-blue-600 text-white text-[10px] px-3 rounded-lg font-bold">Post</button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>
        )}
      </div>

      {/* Photo Overlay Modal */}
      {selectedPhotos && (
        <div className="fixed inset-0 bg-gray-900/90 z-[9999] flex items-center justify-center p-6 backdrop-blur-md" onClick={() => setSelectedPhotos(null)}>
          <div className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button className="absolute top-6 right-8 text-gray-400 hover:text-red-500 text-5xl font-thin z-[10000] transition-colors" onClick={() => setSelectedPhotos(null)}>&times;</button>
            <PhotoCarousel photos={selectedPhotos} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;