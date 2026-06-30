import React, { useState, useEffect } from "react";
import { getStudentMe, updateStudentMe } from "../../api";
import "../../css/pages.css";

function Studentsettings() {
    const [profile, setProfile] = useState({ name: "", email: "", major: "" });
    const [form, setForm] = useState({ name: "", major: "", password: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        getStudentMe()
            .then(r => r.json())
            .then(data => {
                setProfile(data);
                setForm({ name: data.name, major: data.major, password: "" });
            })
            .catch(() => setMessage("Could not load profile."))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        const payload = {};
        if (form.name && form.name !== profile.name) payload.name = form.name;
        if (form.major && form.major !== profile.major) payload.major = form.major;
        if (form.password) payload.password = form.password;

        if (Object.keys(payload).length === 0) {
            setMessage("No changes to save.");
            setSaving(false);
            return;
        }

        const res = await updateStudentMe(payload);
        setSaving(false);

        if (res.ok) {
            setMessage("Profile updated!");
            setProfile(prev => ({ ...prev, ...payload }));
            setForm(prev => ({ ...prev, password: "" }));
        } else {
            const d = await res.json().catch(() => ({}));
            setMessage(d.message || "Failed to update profile.");
        }
    };

    if (loading) return <div className="page-container"><p>Loading profile...</p></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-text">
                    <h2>Profile Settings</h2>
                    <p>Update your personal information below.</p>
                </div>
            </div>

            <div className="settings-form">
                <div className="form-section">
                    <h3 className="form-section-title">Personal Information</h3>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            {/* email changes are not allowed — shown read-only */}
                            <input type="email" value={profile.email} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Major</label>
                            <input
                                type="text"
                                value={form.major}
                                onChange={e => setForm({ ...form, major: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password <span style={{ opacity: 0.5 }}>(leave blank to keep current)</span></label>
                            <input
                                type="password"
                                placeholder="New password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                            />
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        {message && (
                            <p style={{ marginTop: "0.5rem", color: "#f59e0b" }}>{message}</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Studentsettings;
