import React from "react";
import "../../css/pages.css";

function Dashboard() {
    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-text">
                    <h2>Performance Dashboard</h2>
                    <p>Track student progress and engagement across all classes.</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <span className="label">Avg. Attendance</span>
                    <span className="value">88%</span>
                </div>
                <div className="stat-card">
                    <span className="label">Assignments Graded</span>
                    <span className="value">156/200</span>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
