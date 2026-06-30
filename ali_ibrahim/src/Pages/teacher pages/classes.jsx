import React, { useState, useEffect } from "react";
import { getMyClasses, createClass, deleteClass, getClassById, removeStudentFromClass } from "../../api";
import "../../css/pages.css";

function Classes() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addPopup, setAddPopup] = useState(false);
    const [studentsModal, setStudentsModal] = useState(null); // holds the full ClassDto when open
    const [formData, setFormData] = useState({ name: "", maxStudents: 0, schedule: "" });
    const [formError, setFormError] = useState("");

    const fetchClasses = async () => {
        setLoading(true);
        const res = await getMyClasses();
        const data = await res.json();
        setClasses(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => { fetchClasses(); }, []);

    // ── Add class ─────────────────────────────────────────────────────────────
    const handleAddClass = async (e) => {
        e.preventDefault();
        setFormError("");

        const res = await createClass({
            name: formData.name,
            schedule: new Date(formData.schedule).toISOString(),
            maxStudents: parseInt(formData.maxStudents) || 0,
        });

        if (res.ok) {
            setFormData({ name: "", maxStudents: 0, schedule: "" });
            setAddPopup(false);
            fetchClasses();
        } else {
            const d = await res.json().catch(() => ({}));
            setFormError(d.message || "Failed to create class.");
        }
    };

    // ── Delete class ──────────────────────────────────────────────────────────
    const handleDeleteClass = async (id) => {
        if (!window.confirm("Delete this class? All student enrollments will also be removed.")) return;
        const res = await deleteClass(id);
        if (res.ok) fetchClasses();
    };

    // ── View students modal ───────────────────────────────────────────────────
    const openStudentsModal = async (classId) => {
        const res = await getClassById(classId);
        const data = await res.json();
        setStudentsModal(data);
    };

    // ── Remove a student from a class ────────────────────────────────────────
    const handleRemoveStudent = async (classId, studentId) => {
        if (!window.confirm("Remove this student from the class?")) return;
        const res = await removeStudentFromClass(classId, studentId);
        if (res.ok) {
            // re-fetch this class so the modal refreshes immediately
            openStudentsModal(classId);
            // also refresh the main table (student count changes)
            fetchClasses();
        }
    };

    if (loading) return <div className="page-container"><p>Loading classes...</p></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-text">
                    <h2>My Classes</h2>
                    <p>Manage your teaching sections and enrolled students.</p>
                </div>
            </div>

            {/* ── Class list table ────────────────────────────────────────── */}
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Class Name</th>
                            <th>Students</th>
                            <th>Schedule</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.length === 0
                            ? <tr><td colSpan="4">No classes yet — create one below.</td></tr>
                            : classes.map(cls => (
                                <tr key={cls.id}>
                                    <td>{cls.name}</td>
                                    <td>
                                        {cls.currentStudentCount}
                                        {cls.maxStudents > 0 ? ` / ${cls.maxStudents}` : ""}
                                    </td>
                                    <td>{new Date(cls.schedule).toLocaleString()}</td>
                                    <td style={{ display: "flex", gap: "0.5rem" }}>
                                        <button
                                            className="btn btn-ghost"
                                            style={{ fontSize: "0.8rem" }}
                                            onClick={() => openStudentsModal(cls.id)}
                                        >
                                            View Students
                                        </button>
                                        <button
                                            className="btn btn-ghost"
                                            style={{ fontSize: "0.8rem", color: "#ef4444" }}
                                            onClick={() => handleDeleteClass(cls.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            <div className="table-actions">
                <button className="btn btn-primary" onClick={() => setAddPopup(true)}>
                    Add Class
                </button>
            </div>

            {/* ── Add Class modal ─────────────────────────────────────────── */}
            {addPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <div className="popup-header">
                            <h2>Add New Class</h2>
                            <button className="popup-close" onClick={() => { setAddPopup(false); setFormError(""); }}>
                                &times;
                            </button>
                        </div>
                        <div className="popup-body">
                            <form className="popup-form" onSubmit={handleAddClass}>
                                <div className="form-group">
                                    <label>Class Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Section D"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Max Students <span style={{ opacity: 0.5 }}>(0 = unlimited)</span></label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.maxStudents}
                                        onChange={e => setFormData({ ...formData, maxStudents: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.schedule}
                                        onChange={e => setFormData({ ...formData, schedule: e.target.value })}
                                        required
                                    />
                                </div>
                                {formError && <p className="error-message">{formError}</p>}
                                <div className="popup-footer">
                                    <button type="button" className="btn btn-ghost"
                                        onClick={() => { setAddPopup(false); setFormError(""); }}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">Create Class</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ── View / manage students modal ────────────────────────────── */}
            {studentsModal && (
                <div className="popup">
                    <div className="popup-content" style={{ maxWidth: "640px" }}>
                        <div className="popup-header">
                            <h2>
                                {studentsModal.name}
                                <span style={{ fontWeight: 400, fontSize: "0.9rem", marginLeft: "0.5rem", opacity: 0.6 }}>
                                    ({studentsModal.currentStudentCount} student{studentsModal.currentStudentCount !== 1 ? "s" : ""})
                                </span>
                            </h2>
                            <button className="popup-close" onClick={() => setStudentsModal(null)}>&times;</button>
                        </div>
                        <div className="popup-body">
                            {studentsModal.students.length === 0 ? (
                                <p>No students enrolled in this class yet.</p>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Major</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentsModal.students.map(s => (
                                            <tr key={s.id}>
                                                <td>{s.name}</td>
                                                <td>{s.email}</td>
                                                <td>{s.major}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-ghost"
                                                        style={{ fontSize: "0.8rem", color: "#ef4444" }}
                                                        onClick={() => handleRemoveStudent(studentsModal.id, s.id)}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Classes;
