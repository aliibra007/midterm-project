import React, { useState, useEffect } from "react";
import { getMyClasses } from "../api";
import "../css/homepages.css";

function Teacherhomepage({ user }) {
    const [stats, setStats] = useState({ classes: "...", students: "..." });

    useEffect(() => {
        getMyClasses()
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const totalStudents = data.reduce((sum, cls) => sum + (cls.currentStudentCount || 0), 0);
                    setStats({ classes: data.length, students: totalStudents });
                }
            })
            .catch(() => setStats({ classes: "—", students: "—" }));
    }, []);

    return (
        <div className="welcome-section">
            <h1>Teacher <span>Dashboard</span></h1>
            <p>Welcome back, {user?.name || user?.email}! Manage your classes below.</p>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <span className="label">Active Classes</span>
                    <span className="value">{stats.classes}</span>
                </div>
                <div className="stat-card">
                    <span className="label">Total Students</span>
                    <span className="value">{stats.students}</span>
                </div>
                <div className="stat-card">
                    <span className="label">Active Projects</span>
                    <span className="value">—</span>
                </div>
            </div>
        </div>
    );
}

export default Teacherhomepage;
