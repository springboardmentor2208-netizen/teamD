import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    role: "",
    profilePhoto: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id) return;

      try {
        const res = await axios.get(
          `http://localhost:8000/api/auth/get-user/${user.id}`
        );

        setProfileData(res.data);
      } catch (err) {
        console.error("Fetch profile error:", err);
      }
    };

    fetchUser();
  }, [user]);

  const handleChange = e => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/auth/update-user/${user.id}`,
        {
          fullName: profileData.fullName,
          phoneNumber: profileData.phoneNumber,
          location: profileData.location,
          profilePhoto: profileData.profilePhoto
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);

      setIsEditing(false);
      alert("Profile updated!");

    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex justify-center py-10">
      <div className="bg-white shadow rounded-xl w-full max-w-3xl  h-full p-8">

        <div className="flex items-center gap-6 mb-8">

          <img
            src={profileData.profilePhoto || "https://i.pravatar.cc/150"}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />

          <div>
            <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
            <p className="text-gray-500">{profileData.email}</p>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {profileData.role}
            </span>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            name="fullName"
            disabled={!isEditing}
            value={profileData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="border p-2 rounded"
          />

          <input
            value={profileData.email}
            disabled
            className="border p-2 rounded bg-gray-100"
          />

          <input
            name="phoneNumber"
            disabled={!isEditing}
            value={profileData.phoneNumber || ""}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border p-2 rounded"
          />

          <input
            name="location"
            disabled={!isEditing}
            value={profileData.location || ""}
            onChange={handleChange}
            placeholder="Location"
            className="border p-2 rounded"
          />

          <input
            name="profilePhoto"
            disabled={!isEditing}
            value={profileData.profilePhoto || ""}
            onChange={handleChange}
            placeholder="Profile Photo URL"
            className="border p-2 rounded md:col-span-2"
          />

        </div>

        <div className="flex justify-end mt-6 gap-3">

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2 bg-blue-600 text-white rounded"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-5 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
};

export default Profile;
