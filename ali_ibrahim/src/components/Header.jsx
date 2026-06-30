import React from "react";

function Header({ user }) {
    return (
        <header className="app-header">
            <div className="logo">
                <h1>MIDTERM <span>PROJECT</span></h1>
            </div>
            <div className="user-info">
                <span className="text-muted">{user?.name || user?.email}</span>
                <span className="text-muted" style={{ opacity: 0.45, fontSize: "0.75rem", marginLeft: "0.5rem" }}>
                    {user?.role}
                </span>
            </div>
        </header>
    );
}

export default Header;
