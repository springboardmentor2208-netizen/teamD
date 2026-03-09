import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import API from "../api/axios";
import PhotoCarousel from "../components/PhotoCarousel";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


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

  useEffect(() => {
    const results = complaints.filter(c => 
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredComplaints(results);
  }, [searchTerm, complaints]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get("/complaints");
      let data = res.data;
      data.sort((a, b) => sortOrder === "newest" 
        ? new Date(b.createdAt) - new Date(a.createdAt) 
        : new Date(a.createdAt) - new Date(b.createdAt)
      );
      setComplaints(data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const showOnMap = (coords) => {
    if (coords && coords.lat && coords.lng) {
      setMapCenter([coords.lat, coords.lng]);
      setViewMode("map");
    }
  };

  const handleVote = async (complaintId, type) => {
    try {
      await API.post(`/votes/${complaintId}`, { vote_type: type });
      await fetchComplaints(); 
    } catch (err) { alert("Voting failed"); }
  };
  const handleDeleteComplaint = async (id) => {
  console.log("Deleting Complaint ID:", id);
  console.log("Current User Object:", currentUser);
  
  if (!window.confirm("Delete this complaint permanently?")) return;
  try {
    const res = await API.delete(`/complaints/${id}`);
    console.log("Server Response:", res.data);
    fetchComplaints();
  } catch (err) {
    console.error("Delete Error details:", err.response?.data);
    alert(err.response?.data?.message || "Failed to delete complaint");
  }
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

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-blue-600">Updating Feed...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Controls */}
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight underline decoration-blue-500 underline-offset-8">Civic Feed</h1>
          
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search by title or area..." 
              className="px-4 py-2 border rounded-full text-sm w-full md:w-64 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="flex bg-white border rounded-lg p-1 shadow-sm">
              <button onClick={() => setViewMode("list")} className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${viewMode === "list" ? "bg-blue-600 text-white shadow-md" : "text-gray-500"}`}>List</button>
              <button onClick={() => setViewMode("map")} className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${viewMode === "map" ? "bg-blue-600 text-white shadow-md" : "text-gray-500"}`}>Map</button>
            </div>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredComplaints.map((c) => {
              const isMyComplaint = checkOwnership(c.user_id);
              
              return (
                <div key={c._id} className={`bg-white border rounded-3xl shadow-sm flex flex-col h-full overflow-hidden transition-all hover:shadow-xl relative ${isMyComplaint ? "border-blue-200 ring-1 ring-blue-100" : "border-gray-100"}`}>
                  
                  {/* DELETE BUTTON: Visible only to owner */}
                  {isMyComplaint && (
                    <button 
                      onClick={() => handleDeleteComplaint(c._id)}
                      className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-red-500 hover:bg-red-500 hover:text-white transition-all p-2 rounded-xl z-20 shadow-sm border border-red-100"
                      title="Delete your report"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}

                  <div className="p-6 flex-grow">
                    {/* OWNERSHIP TAG */}
                    {isMyComplaint && (
                      <span className="inline-block bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md mb-2 tracking-widest uppercase">Your Report</span>
                    )}
                    
                    <h2 className="font-bold text-gray-800 text-xl mb-2 pr-10">{c.title}</h2>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-black text-blue-700 uppercase bg-blue-100 px-3 py-1 rounded-full">{c.status}</span>
                      <button onClick={() => showOnMap(c.location_coords)} className="text-[11px] text-gray-400 hover:text-blue-600 transition-colors truncate">📍 {c.address}</button>
                    </div>

                    <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-3 italic">"{c.description}"</p>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <button onClick={() => handleVote(c._id, "upvote")} className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full font-bold text-sm hover:bg-green-100 transition-colors">👍 {c.upvotes || 0}</button>
                      <button onClick={() => handleVote(c._id, "downvote")} className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded-full font-bold text-sm hover:bg-red-100 transition-colors">👎 {c.downvotes || 0}</button>
                    </div>

                    {c.photos?.length > 0 && (
                      <button onClick={() => setSelectedPhotos(c.photos)} className="text-blue-600 text-xs font-bold mb-6 flex items-center gap-2 hover:scale-105 transition-transform">
                         <span className="p-2 bg-blue-50 rounded-lg">📸</span> View Evidence ({c.photos.length})
                      </button>
                    )}

                    {/* COMMENTS SECTION */}
                    <div className="bg-gray-50 rounded-2xl p-4 max-h-40 overflow-y-auto text-xs space-y-3 border border-gray-100">
                      <p className="font-bold text-[10px] text-gray-400 uppercase tracking-widest border-b pb-1">Discussion</p>
                      {c.comments?.map((com) => (
                        <div key={com._id} className="flex justify-between items-start group">
                          <p className="flex-1 text-gray-600">
                            <span className="font-extrabold text-blue-600 mr-2">
                              {checkOwnership(com.user_id) ? "You" : (com.user_id?.fullName || "User")}:
                            </span> 
                            {com.content}
                          </p>
                          {checkOwnership(com.user_id) && (
                            <button onClick={() => deleteComment(com._id)} className="text-red-400 hover:text-red-600 font-black ml-2 text-sm px-1">✕</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border-t bg-white">
                      <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Add comment..." 
                            className="flex-1 text-xs bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            value={commentText[c._id] || ""}
                            onChange={(e) => setCommentText({...commentText, [c._id]: e.target.value})}
                          />
                          <button onClick={() => handleComment(c._id)} className="bg-blue-600 text-white text-xs px-5 rounded-xl font-bold hover:bg-blue-700 transition-all">Post</button>
                      </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* --- MAP VIEW --- */
          <div className="h-[600px] w-full rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative">
            <MapContainer center={mapCenter} zoom={12} className="h-full w-full">
              <ChangeView center={mapCenter} />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {filteredComplaints.map((c) => (
                c.location_coords && (
                  <Marker key={c._id} position={[c.location_coords.lat, c.location_coords.lng]}>
                    <Popup maxWidth={300}>
                      <div className="p-1 w-full min-w-[200px]">
                        {checkOwnership(c.user_id) && (
                          <div className="flex justify-between items-center mb-1">
                            <span className="bg-blue-600 text-white text-[8px] px-1 rounded">YOUR REPORT</span>
                            <button onClick={() => handleDeleteComplaint(c._id)} className="text-red-500 text-[10px] font-bold">DELETE</button>
                          </div>
                        )}
                        <h3 className="font-bold text-sm mb-2 text-blue-800">{c.title}</h3>
                        {/* Map Popup UI continues similarly... */}
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>
        )}
      </div>

      {/* PHOTO MODAL */}
      {selectedPhotos && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-6 backdrop-blur-sm" onClick={() => setSelectedPhotos(null)}>
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-4xl font-light z-[10000] transition-colors" onClick={() => setSelectedPhotos(null)}>&times;</button>
            <PhotoCarousel photos={selectedPhotos} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;