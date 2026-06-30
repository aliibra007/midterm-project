import React, { useState, useEffect } from "react";
import { adminGetStudents, adminCreateStudent, adminDeleteStudent } from "../../api";
import "../../css/pages.css";

function ManageStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popup, setPopup] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", major: "Computer Science" });
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchStudents = async () => {
        setLoading(true);
        const res = await adminGetStudents();
        const data = await res.json();
        setStudents(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => { fetchStudents(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setFormError("");
        setSaving(true);

        const res = await adminCreateStudent(form);
        setSaving(false);

        if (res.ok) {
            setForm({ name: "", email: "", password: "", major: "Computer Science" });
            setPopup(false);
            fetchStudents();
        } else {
            const d = await res.json().catch(() => ({}));
            setFormError(d.message || "Failed to create student.");
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete student "${name}"? This will also remove all their enrollments.`)) return;
        const res = await adminDeleteStudent(id);
        if (res.ok) fetchStudents();
    };

    if (loading) return <div className="page-container"><p>Loading students...</p></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-text">
                    <h2>Manage Students</h2>
                    <p>Create new student accounts or remove existing ones.</p>
                </div>
            </div>

            <div className="table-wrapper">
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
                        {students.length === 0
                            ? <tr><td colSpan="4">No student accounts yet.</td></tr>
                            : students.map(s => (
                                <tr key={s.id}>
                                    <td>{s.name}</td>
                                    <td>{s.email}</td>
                                    <td>{s.major}</td>
                                    <td>
                                        <button
                                            className="btn btn-ghost"
                                            style={{ fontSize: "0.8rem", color: "#ef4444" }}
                                            onClick={() => handleDelete(s.id, s.name)}
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
                <button className="btn btn-primary" onClick={() => setPopup(true)}>
                    Create Student
                </button>
            </div>

            {popup && (
                <div className="popup">
                    <div className="popup-content">
                        <div className="popup-header">
                            <h2>Create Student Account</h2>
                            <button className="popup-close" onClick={() => { setPopup(false); setFormError(""); }}>&times;</button>
                        </div>
                        <div className="popup-body">
                            <form className="popup-form" onSubmit={handleCreate}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" placeholder="Student name" value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" placeholder="student@example.com" value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" placeholder="At least 6 characters" value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                                </div>
                                <div className="form-group">
                                    <label>Major</label>
                                    <input type="text" value={form.major}
                                        onChange={e => setForm({ ...form, major: e.target.value })} />
                                </div>
                                {formError && <p className="error-message">{formError}</p>}
                                <div className="popup-footer">
                                    <button type="button" className="btn btn-ghost"
                                        onClick={() => { setPopup(false); setFormError(""); }}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? "Creating..." : "Create Account"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageStudents;
