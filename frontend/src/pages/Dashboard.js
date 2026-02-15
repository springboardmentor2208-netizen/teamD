
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    // Mock data for statistics
    const stats = [
        { label: 'Total Issues', value: 4, icon: '⚠️', color: 'text-gray-800' },
        { label: 'Pending', value: 4, icon: '🕒', color: 'text-blue-600' },
        { label: 'In Progress', value: 0, icon: '⚙️', color: 'text-yellow-600' },
        { label: 'Resolved', value: 0, icon: '✅', color: 'text-green-600' },
    ];

    // Mock data for recent activity
    const recentActivity = [
        {
            id: 1,
            title: 'Pothole on Main Street resolved',
            time: '2 hours ago',
            type: 'resolved'
        },
        {
            id: 2,
            title: 'New streetlight issue reported',
            time: '4 hours ago',
            type: 'reported'
        },
        {
            id: 3,
            title: 'Garbage dump complaint updated',
            time: '6 hours ago',
            type: 'updated'
        }
    ];

    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="min-h-screen pt-[10vh]     bg-gradient-to-r 
    from-blue-900 via-[#bdb5b5cc] to-indigo-900
    bg-300%">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-300 mb-8">
                    Welcome, {user ? user.username : 'User'}
                </h1>

                {/* Dashboard Stats */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-300 mb-4">Dashboard</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-[#ffffff5c] backdrop-blur-lg rounded-lg shadow p-6 flex flex-col items-center justify-center">
                                <span className="text-4xl mb-2">{stat.icon}</span>
                                <span className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</span>
                                <span className="text-gray-300 font-medium">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1  lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-300 mb-4">Recent Activity</h2>
                        <div className="bg-[#ffffff5c] backdrop-blur-lg rounded-lg shadow overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                {recentActivity.map((activity) => (
                                    <li key={activity.id} className="p-6 hover:bg-gray-300 transition duration-150 ease-in-out">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 mr-4">
                                                {activity.type === 'resolved' && <span className="w-2 h-2 rounded-full bg-green-500 block mt-2"></span>}
                                                {activity.type === 'reported' && <div className="text-blue-500 bg-blue-100 rounded-full p-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg></div>}
                                                {activity.type === 'updated' && <span className="w-2 h-2 rounded-full bg-yellow-500 block mt-2"></span>}
                                            </div>
                                            <div>
                                                <p className="text-gray-800 font-medium text-sm sm:text-base">{activity.title}</p>
                                                <p className="text-white-300 text-xs sm:text-sm mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-300 mb-4">Quick Actions</h2>
                        <div className="bg-[#ffffff5c] backdrop-blur-lg rounded-lg shadow p-6 space-y-4">
                            <Link to="/report" className="block w-full backdrop-blur-lg bg-[#0000ff8a] hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition duration-200 text-center flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Report New Issue
                            </Link>
                            <Link to="/complaints" className="block w-full bg-[#ffffff5c] backdrop-blur-lgborder border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded transition duration-200 text-center flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                                View All Complaints
                            </Link>
                            <button className="block w-full bg-[#ffffff5c] backdrop-blur-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded transition duration-200 text-center flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7"></path></svg>
                                Issue Map
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
