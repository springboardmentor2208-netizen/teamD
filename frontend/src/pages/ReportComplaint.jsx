import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import API from "../api/axios";
import uploadImage from "../utils/upload";
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
      alert("Please fill all fields and pick a location");
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
      alert("Submitted successfully");
      setForm({ title: "", description: "", address: "" });
      setFiles([]);
      setCoords(null);
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Report Issue</h2>
        <form onSubmit={submitComplaint} className="space-y-4">
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="w-full border p-3 rounded" />
          <textarea name="description" placeholder="Description" rows="4" value={form.description} onChange={handleChange} className="w-full border p-3 rounded" />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full border p-3 rounded" />
          
          <div>
            <label className="block text-sm mb-1">Photos (Max 5)</label>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="w-full border p-2 rounded" />
          </div>

          <div className="h-64 rounded overflow-hidden border">
            <MapContainer center={[17.385, 78.486]} zoom={13} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker setCoords={setCoords} setForm={setForm} />
              {coords && <Marker position={[coords.lat, coords.lng]} />}
            </MapContainer>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded font-bold">
            {loading ? "Uploading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportComplaint;