import React, { useState, useEffect } from "react";
import { getMyClasses, getAllClasses, enrollInClass } from "../../api";
import "../../css/pages.css";

function StudentCourses() {
    const [enrolled, setEnrolled] = useState([]);
    const [available, setAvailable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const [myRes, allRes] = await Promise.all([getMyClasses(), getAllClasses()]);
            const myClasses = await myRes.json();
            const allClasses = await allRes.json();

            const enrolledList = Array.isArray(myClasses) ? myClasses : [];
            const allList = Array.isArray(allClasses) ? allClasses : [];

            setEnrolled(enrolledList);

            // filter out classes the student is already in
            const enrolledIds = new Set(enrolledList.map(c => c.id));
            setAvailable(allList.filter(c => !enrolledIds.has(c.id)));
        } catch {
            setError("Could not load courses. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleEnroll = async (classId) => {
        const res = await enrollInClass(classId);
        if (res.ok) {
            fetchData(); // refresh both lists after enrolling
        } else {
            const d = await res.json().catch(() => ({}));
            alert(d.message || "Could not enroll in this class.");
        }
    };

    if (loading) return <div className="page-container"><p>Loading courses...</p></div>;
    if (error) return <div className="page-container"><p className="error-message">{error}</p></div>;

    return (
        <>
            <div className="page-header">
                <div className="page-header-text">
                    <h2>My Courses</h2>
                    <p>Classes you are currently enrolled in.</p>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Class Name</th>
                            <th>Teacher</th>
                            <th>Schedule</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrolled.length === 0
                            ? <tr><td colSpan="3">You are not enrolled in any classes yet.</td></tr>
                            : enrolled.map(c => (
                                <tr key={c.id}>
                                    <td>{c.name}</td>
                                    <td>{c.teacherName}</td>
                                    <td>{new Date(c.schedule).toLocaleString()}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {available.length > 0 && (
                <>
                    <div className="page-header" style={{ marginTop: "2rem" }}>
                        <div className="page-header-text">
                            <h3>Available Classes</h3>
                            <p>Click Enroll to join a class.</p>
                        </div>
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Class Name</th>
                                    <th>Spots</th>
                                    <th>Schedule</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {available.map(c => {
                                    const isFull = c.maxStudents > 0 && c.currentStudentCount >= c.maxStudents;
                                    return (
                                        <tr key={c.id}>
                                            <td>{c.name}</td>
                                            <td>
                                                {c.maxStudents === 0
                                                    ? "Unlimited"
                                                    : `${c.currentStudentCount} / ${c.maxStudents}`}
                                            </td>
                                            <td>{new Date(c.schedule).toLocaleString()}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: "0.25rem 0.75rem", fontSize: "0.8rem" }}
                                                    onClick={() => handleEnroll(c.id)}
                                                    disabled={isFull}
                                                >
                                                    {isFull ? "Full" : "Enroll"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </>
    );
}

export default StudentCourses;
