import React, { useState, useEffect } from "react";
import { getMyClasses } from "../api";
import "../css/homepages.css";

function Studenthomepage({ user }) {
    const [classCount, setClassCount] = useState("...");

    useEffect(() => {
        getMyClasses()
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setClassCount(data.length);
            })
            .catch(() => setClassCount("—"));
    }, []);

    return (
        <div className="welcome-section">
            <h1>Student <span>Dashboard</span></h1>
            <p>Welcome back, {user?.name || user?.email}! Here's your overview.</p>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <span className="label">Enrolled Classes</span>
                    <span className="value">{classCount}</span>
                </div>
                <div className="stat-card">
                    <span className="label">Attendance Rate</span>
                    <span className="value">—</span>
                </div>
                <div className="stat-card">
                    <span className="label">Pending Projects</span>
                    <span className="value">—</span>
                </div>
            </div>
        </div>
    );
}

export default Studenthomepage;
