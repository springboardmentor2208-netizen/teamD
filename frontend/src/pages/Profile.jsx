import React, { useState, useEffect } from "react";
import API from "../api/axios"; 

const Profile = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    role: "",
    profilePhoto: ""
  });

  useEffect(() => {
    
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        location: user.location || "",
        role: user.role || "",
        profilePhoto: user.profilePhoto || ""
      });
    }

    // 2. Fetch fresh data from backend
    const fetchUser = async () => {
      if (!user?.id && !user?._id) return;
      const userId = user.id || user._id;

      try {
        const res = await API.get(`/auth/get-user/${userId}`);
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
      setLoading(true);
      const userId = user.id || user._id;

      
      const res = await API.put(`/auth/update-user/${userId}`, {
        fullName: profileData.fullName,
        phoneNumber: profileData.phoneNumber,
        location: profileData.location,
        profilePhoto: profileData.profilePhoto
      });

      
      const updatedUser = { ...user, ...res.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Update failed. Check if your role allows this.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-6 bg-gradient-to-br from-blue-300 to-blue-700">
      <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Profile Header */}
        <div className="bg-slate-900 p-10 text-white flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <img
              src={profileData.profilePhoto || "https://i.pravatar.cc/150"}
              alt="avatar"
              className="w-32 h-32 rounded-[2rem] object-cover border-4 border-slate-800 shadow-2xl"
            />
            {isEditing && (
              <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl text-xs font-black uppercase">
                Edit Mode
              </div>
            )}
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black italic tracking-tighter mb-1">
              {profileData.fullName || "User Name"}
            </h2>
            <p className="text-slate-400 font-bold text-sm mb-4">{profileData.email}</p>
            <span className="text-[10px] font-black bg-blue-600 text-white px-4 py-1.5 rounded-xl uppercase tracking-widest">
              {profileData.role} Access
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
              <input
                name="fullName"
                disabled={!isEditing}
                value={profileData.fullName}
                onChange={handleChange}
                className={`w-full p-4 rounded-2xl font-bold transition-all ${isEditing ? "bg-slate-50 border-blue-100 border-2" : "bg-white border-transparent cursor-not-allowed"}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email (Static)</label>
              <input
                value={profileData.email}
                disabled
                className="w-full p-4 rounded-2xl bg-slate-100 font-bold text-slate-400 border-transparent cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Phone Number</label>
              <input
                name="phoneNumber"
                disabled={!isEditing}
                value={profileData.phoneNumber}
                onChange={handleChange}
                placeholder="Ex: +91 98765 43210"
                className={`w-full p-4 rounded-2xl font-bold transition-all ${isEditing ? "bg-slate-50 border-blue-100 border-2" : "bg-white border-transparent"}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Home Address</label>
              <input
                name="location"
                disabled={!isEditing}
                value={profileData.location}
                onChange={handleChange}
                className={`w-full p-4 rounded-2xl font-bold transition-all ${isEditing ? "bg-slate-50 border-blue-100 border-2" : "bg-white border-transparent"}`}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Profile Avatar URL</label>
              <input
                name="profilePhoto"
                disabled={!isEditing}
                value={profileData.profilePhoto}
                onChange={handleChange}
                className={`w-full p-4 rounded-2xl font-bold transition-all ${isEditing ? "bg-slate-50 border-blue-100 border-2" : "bg-white border-transparent"}`}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-50">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:-translate-y-1 transition-all"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-10 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:-translate-y-1 transition-all disabled:bg-slate-300"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;