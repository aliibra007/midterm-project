import React, { useState, useEffect } from "react";
import { getAdminStats } from "../api";
import "../css/homepages.css";

function Adminhomepage({ user }) {
    const [stats, setStats] = useState({ studentCount: "...", teacherCount: "...", classCount: "..." });

    useEffect(() => {
        getAdminStats()
            .then(r => r.json())
            .then(data => setStats(data))
            .catch(() => setStats({ studentCount: "—", teacherCount: "—", classCount: "—" }));
    }, []);

    return (
        <div className="welcome-section">
            <h1>Admin <span>Dashboard</span></h1>
            <p>Welcome, {user?.name}. Manage all accounts from the sidebar.</p>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <span className="label">Total Students</span>
                    <span className="value">{stats.studentCount}</span>
                </div>
                <div className="stat-card">
                    <span className="label">Total Teachers</span>
                    <span className="value">{stats.teacherCount}</span>
                </div>
                <div className="stat-card">
                    <span className="label">Total Classes</span>
                    <span className="value">{stats.classCount}</span>
                </div>
            </div>
        </div>
    );
}

export default Adminhomepage;
