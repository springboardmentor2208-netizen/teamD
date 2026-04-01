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
  // Logic to determine zone based on Map Coordinates
  const getZoneFromCoordinates = (lat, lng) => {
    // These are example coordinates. 
    // Adjust the 17.4 and 78.5 values to match your city's center point.
    if (lat > 17.42) return "North";
    if (lat < 17.36) return "South";
    if (lng > 78.52) return "East";
    if (lng < 78.43) return "West";
    return "Central";
  };

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setCoords({ lat, lng });

      // 1. Instantly calculate zone mathematically (No API delay)
      const detectedZone = getZoneFromCoordinates(lat, lng);

      try {
        // 2. Fetch the human-readable address
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        
        setForm(prev => ({ 
          ...prev, 
          address: data.display_name || "Unknown Location", 
          zone: detectedZone // Assigned via math, not text matching
        }));
      } catch (err) {
        console.error("Geocoding failed:", err);
        // Fallback: even if API fails, the Zone is already calculated!
        setForm(prev => ({ ...prev, zone: detectedZone }));
      }
    }
  });
  return null;
};

const ReportComplaint = () => {
  const [form, setForm] = useState({ title: "", description: "", address: "", zone: "" });
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
    if (!form.title || !form.description || !form.address || !coords || !form.zone) {
      alert("Please fill all fields and pick a location on the map to detect your zone.");
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
      alert(`Success! Incident reported and auto-assigned to ${form.zone} Zone.`);
      setForm({ title: "", description: "", address: "", zone: "" });
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
    <div className="min-h-screen bg-[#f8fafc] pb-20 bg-gradient-to-br from-blue-300 to-blue-700 font-sans">
      <div className="border-b border-slate-200 py-12 mb-10">
        <div className="max-w-6xl mx-auto px-6">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 block mb-2">Operational Logic</span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Automated Dispatch</h1>
          <p className="text-slate-800 font-medium mt-1 text-sm">Select a location; the system will automatically resolve the administrative zone.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <form onSubmit={submitComplaint} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded-full"></span> 01. Ticket Details
              </h3>
              
              <div className="space-y-4">
                {/* AUTO-DETECTED ZONE UI (Replacing the Dropdown) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">Detected Zone</label>
                  <div className={`w-full p-4 rounded-2xl flex justify-between items-center transition-all border ${form.zone ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <span className={`text-xs font-black uppercase tracking-widest ${form.zone ? 'text-white' : 'text-slate-300'}`}>
                      {form.zone ? `${form.zone} Administrative Region` : "Waiting for Map Selection..."}
                    </span>
                    {form.zone && (
                      <span className="bg-blue-600 text-[8px] px-2 py-1 rounded-lg font-black uppercase text-white animate-pulse">
                        Auto-Matched
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">Subject</label>
                  <input name="title" placeholder="Issue Title" value={form.title} onChange={handleChange} className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-800" />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1 block">Description</label>
                  <textarea name="description" placeholder="Describe the concern..." rows="4" value={form.description} onChange={handleChange} className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-800" />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded-full"></span> 02. Visual Evidence
              </h3>
              <div className="relative group text-center">
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 p-8 rounded-3xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <span className="text-3xl mb-2">📸</span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {files.length > 0 ? `${files.length} Photos Prepared` : "Attach Media (Max 5)"}
                  </p>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded-full"></span> 03. Live Location Tracking
              </h3>
              
              <div className="h-80 rounded-3xl overflow-hidden border border-slate-100 mb-4 shadow-inner">
                <MapContainer center={[17.385, 78.486]} zoom={13} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker setCoords={setCoords} setForm={setForm} />
                  {coords && <Marker position={[coords.lat, coords.lng]} />}
                </MapContainer>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                 <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block italic">Address Resolved via Nominatim API</label>
                 <p className="text-[11px] font-bold text-slate-500 italic truncate">
                   {form.address || "Click map to initialize GPS..."}
                 </p>
              </div>
            </div>

            <button type="submit" disabled={loading} className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] transition-all shadow-2xl ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-slate-900 hover:bg-black text-white hover:-translate-y-1"}`}>
              {loading ? "Synchronizing with Server..." : "Submit Official Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportComplaint;