import React, { useEffect, useState } from "react";
import axios from "axios";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/complaints");
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints", err);
    }
  };

  const handleVote = async (complaintId, type) => {
    try {
      await axios.post(
        `http://localhost:8000/api/votes/${complaintId}`,
        { vote_type: type },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchComplaints(); // refresh after vote
    } catch (err) {
      alert("Voting failed");
    }
  };

  const getStatusColor = status => {
    if (status === "received") return "bg-blue-100 text-blue-700";
    if (status === "in_review") return "bg-yellow-100 text-yellow-700";
    if (status === "resolved") return "bg-green-100 text-green-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 py-10 px-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Civic Complaints Dashboard
        </h1>

        {complaints.length === 0 && (
          <div className="text-center text-gray-500">
            No complaints yet.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">

          {complaints.map(c => (
            <div
              key={c._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-6"
            >

              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold">{c.title}</h2>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    c.status
                  )}`}
                >
                  {c.status.replace("_", " ")}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-3">{c.description}</p>

              {/* Address */}
              <p className="text-sm text-gray-500 mb-3">
                📍 {c.address}
              </p>

              {/* Photo */}
              {c.photo && (
                <img
                  src={c.photo}
                  alt="complaint"
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}

              {/* Voting Section */}
              <div className="flex justify-between items-center border-t pt-4">

                <div className="flex gap-4">

                  <button
                    onClick={() => handleVote(c._id, "upvote")}
                    className="flex items-center gap-1 text-green-600 hover:scale-105 transition"
                  >
                    👍 {c.upvotes || 0}
                  </button>

                  <button
                    onClick={() => handleVote(c._id, "downvote")}
                    className="flex items-center gap-1 text-red-600 hover:scale-105 transition"
                  >
                    👎 {c.downvotes || 0}
                  </button>

                </div>

                <span className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default Complaints;