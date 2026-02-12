import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ user, setUser }) => {
    // State for toggle (view/edit mode - logic to be added later)
    const [isEditing, setIsEditing] = useState(false);

    // Placeholder data for fields not yet in backend
    const [profileData, setProfileData] = useState({
        fullName: '',
        username: '',
        email: '',
        phoneNumber: '',
        location: 'Downtown District',
        bio: 'Active citizen helping to improve our community through CleanStreet reporting.',
        profilePicture: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (user && user.id) {
                try {
                    const res = await axios.get(`http://localhost:5000/api/auth/get-user/${user.id}`);
                    setProfileData(prevState => ({
                        ...prevState,
                        fullName: res.data.fullName,
                        username: res.data.username,
                        email: res.data.email,
                        phoneNumber: res.data.phoneNumber || '',
                        location: res.data.location || '',
                        bio: res.data.bio || '',
                        profilePicture: res.data.profilePicture || ''
                    }));
                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
            }
        };

        fetchUserData();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            const res = await axios.post(`http://localhost:5000/api/auth/upload-profile-pic/${user.id}`, formData, config);

            setProfileData(prev => ({ ...prev, profilePicture: res.data.file }));

            // Update local storage user object if it contains profilePicture
            const updatedUser = { ...user, profilePicture: res.data.file };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            alert('Profile picture uploaded successfully!');
        } catch (err) {
            console.error("Error uploading image:", err);
            const errorMsg = err.response?.data?.msg || err.response?.data?.error || err.message;
            alert(`Failed to upload image: ${errorMsg}`);
        }
    };

    const handleSave = async () => {
        if (!user || !user.id) return;

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const body = JSON.stringify({
                fullName: profileData.fullName,
                phoneNumber: profileData.phoneNumber,
                location: profileData.location,
                bio: profileData.bio
            });

            await axios.put(`http://localhost:5000/api/auth/update-user/${user.id}`, body, config);

            // Update local storage and app state
            const updatedUser = { ...user, fullName: profileData.fullName, email: profileData.email };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error("Error updating profile:", err);
            alert('Failed to update profile. Please try again.');
        }
    };

    // Helper to get initials
    const getInitials = (name) => {
        return name
            ? name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2)
            : 'U';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your account information and preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: User Card */}
                    <div className="col-span-1">
                        <div className="bg-white shadow rounded-lg p-6 text-center">
                            <div className="relative inline-block">
                                <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm mx-auto mb-4">
                                    {profileData.profilePicture ? (
                                        <img src={profileData.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-blue-600 text-4xl font-bold">{getInitials(profileData.fullName)}</span>
                                    )}
                                </div>
                                <label htmlFor="profileImage" className="absolute bottom-2 right-0 bg-white rounded-full p-2 shadow hover:bg-gray-50 border border-gray-200 cursor-pointer" title="Change Avatar">
                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    <input
                                        type="file"
                                        id="profileImage"
                                        name="profileImage"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>

                            <h2 className="text-xl font-bold text-gray-900">{profileData.fullName}</h2>
                            <p className="text-gray-500 text-sm mb-4">@{profileData.username}</p>

                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
                                Citizen
                            </span>

                            <p className="text-gray-600 text-sm mb-6">
                                {profileData.bio}
                            </p>

                            <div className="border-t border-gray-200 pt-4">
                                <p className="text-xs text-gray-400">
                                    Member since {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Account Information */}
                    <div className="col-span-1 lg:col-span-2">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="bg-blue-50 rounded-full p-2 mr-3">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                                        <p className="text-sm text-gray-500">Update your personal details</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                    {isEditing ? 'Cancel' : 'Edit'}
                                </button>
                            </div>

                            <div className="p-6">
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Username */}
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                                Username
                                            </div>
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            id="username"
                                            disabled={true} // Usually username is immutable or hard to change
                                            value={profileData.username}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50 text-gray-500 p-2 border"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                Email
                                            </div>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            disabled={true} // Often email change requires verification, keeping simple for now
                                            value={profileData.email}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50 text-gray-500 p-2 border"
                                        />
                                    </div>

                                    {/* Full Name */}
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            id="fullName"
                                            disabled={!isEditing}
                                            value={profileData.fullName}
                                            onChange={handleChange}
                                            className={`block w-full rounded-md shadow-sm sm:text-sm p-2 border ${isEditing ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-500'}`}
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                Phone Number
                                            </div>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            id="phoneNumber"
                                            disabled={!isEditing}
                                            value={profileData.phoneNumber}
                                            onChange={handleChange}
                                            className={`block w-full rounded-md shadow-sm sm:text-sm p-2 border ${isEditing ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-500'}`}
                                        />
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                Location
                                            </div>
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            id="location"
                                            disabled={!isEditing}
                                            value={profileData.location}
                                            onChange={handleChange}
                                            className={`block w-full rounded-md shadow-sm sm:text-sm p-2 border ${isEditing ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-500'}`}
                                        />
                                    </div>

                                    {/* Bio */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                            Bio
                                        </label>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            rows="3"
                                            disabled={!isEditing}
                                            value={profileData.bio}
                                            onChange={handleChange}
                                            className={`block w-full rounded-md shadow-sm sm:text-sm p-2 border ${isEditing ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-500'}`}
                                        ></textarea>
                                    </div>
                                </form>
                            </div>

                            {isEditing && (
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
