import React, { useState, useEffect } from "react";
import { adminGetTeachers, adminCreateTeacher, adminDeleteTeacher } from "../../api";
import "../../css/pages.css";

function ManageTeachers() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popup, setPopup] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchTeachers = async () => {
        setLoading(true);
        const res = await adminGetTeachers();
        const data = await res.json();
        setTeachers(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => { fetchTeachers(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setFormError("");
        setSaving(true);

        const res = await adminCreateTeacher(form);
        setSaving(false);

        if (res.ok) {
            setForm({ name: "", email: "", password: "" });
            setPopup(false);
            fetchTeachers();
        } else {
            const d = await res.json().catch(() => ({}));
            setFormError(d.message || "Failed to create teacher.");
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete teacher "${name}"? This will also remove all their classes and enrolled students.`)) return;
        const res = await adminDeleteTeacher(id);
        if (res.ok) fetchTeachers();
    };

    if (loading) return <div className="page-container"><p>Loading teachers...</p></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-text">
                    <h2>Manage Teachers</h2>
                    <p>Create new teacher accounts or remove existing ones.</p>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Classes</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.length === 0
                            ? <tr><td colSpan="4">No teacher accounts yet.</td></tr>
                            : teachers.map(t => (
                                <tr key={t.id}>
                                    <td>{t.name}</td>
                                    <td>{t.email}</td>
                                    <td>{t.classes?.length ?? 0}</td>
                                    <td>
                                        <button
                                            className="btn btn-ghost"
                                            style={{ fontSize: "0.8rem", color: "#ef4444" }}
                                            onClick={() => handleDelete(t.id, t.name)}
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
                    Create Teacher
                </button>
            </div>

            {popup && (
                <div className="popup">
                    <div className="popup-content">
                        <div className="popup-header">
                            <h2>Create Teacher Account</h2>
                            <button className="popup-close" onClick={() => { setPopup(false); setFormError(""); }}>&times;</button>
                        </div>
                        <div className="popup-body">
                            <form className="popup-form" onSubmit={handleCreate}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" placeholder="Teacher name" value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" placeholder="teacher@example.com" value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" placeholder="At least 6 characters" value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
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

export default ManageTeachers;
