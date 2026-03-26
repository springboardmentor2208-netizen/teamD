import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import API from "../api/axios";
import uploadImage from "../utils/upload";

// Fixing Leaflet marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationPicker = ({ setCoords, setForm }) => {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setCoords({ lat, lng });
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        if (data.display_name) {
          setForm(prev => ({ ...prev, address: data.display_name }));
        }
      } catch (err) {
        console.error(err);
      }
    }
  });
  return null;
};

const ReportComplaint = () => {
  const [form, setForm] = useState({ title: "", description: "", address: "" });
  const [files, setFiles] = useState([]);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 5) {
      alert("Maximum 5 photos allowed");
      e.target.value = "";
      return;
    }
    setFiles(selectedFiles);
  };

  const submitComplaint = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.address || !coords) {
      alert("Please fill all fields and pick a location on the map.");
      return;
    }

    try {
      setLoading(true);
      const uploadPromises = files.map(file => uploadImage(file));
      const imageUrls = await Promise.all(uploadPromises);

      const payload = {
        ...form,
        photos: imageUrls,
        location_coords: coords
      };

      await API.post("/complaints", payload);
      alert("Report submitted successfully!");
      setForm({ title: "", description: "", address: "" });
      setFiles([]);
      setCoords(null);
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 bg-gradient-to-br from-blue-100 to-blue-300">
      {/* Header Section */}
      <div className=" border-b border-slate-200 py-12 mb-10">
        <div className="max-w-6xl mx-auto px-6">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 block mb-2">Issue Reporting</span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Create New Ticket</h1>
          <p className="text-slate-400 font-medium mt-1 text-sm">Provide details and pin the exact location of the concern.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <form onSubmit={submitComplaint} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* LEFT COLUMN: Details */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded-full"></span> 01. General Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">Subject</label>
                  <input 
                    name="title" 
                    placeholder="Brief title of the issue" 
                    value={form.title} 
                    onChange={handleChange} 
                    className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-800" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">Description</label>
                  <textarea 
                    name="description" 
                    placeholder="Provide as much detail as possible..." 
                    rows="4" 
                    value={form.description} 
                    onChange={handleChange} 
                    className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-800" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded-full"></span> 02. Visual Evidence
              </h3>
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileChange} 
                  className="hidden" 
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload" 
                  className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 p-8 rounded-3xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📸</span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {files.length > 0 ? `${files.length} Files Selected` : "Upload Photos (Max 5)"}
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Map & Submission */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded-full"></span> 03. Location Mapping
              </h3>
              
              <div className="h-80 rounded-3xl overflow-hidden border border-slate-100 mb-4">
                <MapContainer center={[17.385, 78.486]} zoom={13} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker setCoords={setCoords} setForm={setForm} />
                  {coords && <Marker position={[coords.lat, coords.lng]} />}
                </MapContainer>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                 <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Detected Address</label>
                 <p className="text-xs font-bold text-slate-600 truncate">
                   {form.address || "Click on the map to set location..."}
                 </p>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] transition-all shadow-xl ${
                loading ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-1"
              }`}
            >
              {loading ? "Processing Ticket..." : "Submit Official Report"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReportComplaint;