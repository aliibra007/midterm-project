import React from "react";
import "../../css/pages.css";

function Studentattendance() {
    const attendance = [
        { date: "2024-05-01", course: "Introduction to React", status: "Present" },
        { date: "2024-05-01", course: "Advanced CSS", status: "Present" },
        { date: "2024-04-30", course: "Node.js Fundamentals", status: "Absent" },
    ];

    return (
        <>
            <div className="page-header">
                <div className="page-header-text">
                    <h2>Attendance Record</h2>
                    <p>Keep track of your presence in all classes.</p>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Course</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map((record, index) => (
                            <tr key={index}>
                                <td>{record.date}</td>
                                <td>{record.course}</td>
                                <td>
                                    <span className={`badge ${record.status === 'Present' ? 'badge-success' : 'badge-warning'}`}>
                                        {record.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Studentattendance;
