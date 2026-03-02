import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import API from "../api/axios";
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
          setForm(prev => ({
            ...prev,
            address: data.display_name
          }));
        }
      } catch (err) {
        console.error("Geocoding error:", err);
      }
    }
  });
  return null;
};

const ReportComplaint = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    photo: ""
  });

  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitComplaint = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.address) {
      alert("Please fill all required fields");
      return;
    }

    if (!coords) {
      alert("Please select a location on the map");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        location_coords: coords
      };

      await API.post("/complaints", payload);
      
      alert("Complaint submitted successfully!");
      
      setForm({
        title: "",
        description: "",
        address: "",
        photo: ""
      });
      setCoords(null);

    } catch (err) {
      console.error("Submission Error Details:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error submitting complaint. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Report a Civic Issue
        </h2>

        <form onSubmit={submitComplaint} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              name="title"
              placeholder="e.g. Broken Street Light"
              value={form.title}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Describe the issue in detail..."
              rows="4"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              name="address"
              placeholder="Click on the map or type address"
              value={form.address}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL (Optional)</label>
            <input
              name="photo"
              placeholder="Paste image link here"
              value={form.photo}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Location on Map</label>
            <div className="h-64 rounded-lg overflow-hidden border-2 border-gray-200">
              <MapContainer
                center={[17.385044, 78.486671]}
                zoom={13}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker setCoords={setCoords} setForm={setForm} />
                {coords && <Marker position={[coords.lat, coords.lng]} />}
              </MapContainer>
            </div>
            <p className="text-xs text-gray-500 italic">
              * The address field will update automatically when you click the map.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-bold transition-all ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 shadow-md"
            }`}
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportComplaint;