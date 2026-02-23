import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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


const LocationPicker = ({ setCoords }) => {
  useMapEvents({
    click(e) {
      setCoords({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
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

  const token = localStorage.getItem("token");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitComplaint = async e => {
    e.preventDefault();

    if (!form.title || !form.description || !form.address) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8000/api/complaints",
        {
          ...form,
          location_coords: coords
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Complaint submitted successfully!");

      setForm({
        title: "",
        description: "",
        address: "",
        photo: ""
      });

      setCoords(null);

    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">

      <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-8">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Report a Civic Issue
        </h2>

        <form onSubmit={submitComplaint} className="space-y-4">

          <input
            name="title"
            placeholder="Issue Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <textarea
            name="description"
            placeholder="Describe the issue..."
            rows="4"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            name="photo"
            placeholder="Photo URL (optional)"
            value={form.photo}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          {/* MAP */}
          <div className="h-64 rounded overflow-hidden border">

            <MapContainer
              center={[17.385044, 78.486671]}
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <LocationPicker setCoords={setCoords} />

              {coords && <Marker position={[coords.lat, coords.lng]} />}

            </MapContainer>

          </div>

          <p className="text-sm text-gray-500">
            Click on map to select exact location
          </p>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default ReportComplaint;