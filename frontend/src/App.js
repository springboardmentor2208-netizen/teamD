import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Complaints from './pages/Complaints';
import Footer from './components/Footer';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setUser(foundUser);
        }
    }, []);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        window.location.href = '/login'; // Force refresh/redirect
    };

    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navbar user={user} onLogout={handleLogout} />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/login"
                            element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/register"
                            element={!user ? <Register /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/dashboard"
                            element={user ? <Dashboard /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/profile"
                            element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/report"
                            element={user ? <Reports/> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/complaints"
                            element={user ? <Complaints/> : <Navigate to="/login" />}
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
