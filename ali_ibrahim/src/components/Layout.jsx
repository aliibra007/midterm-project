import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import "../css/global.css";

function Layout({ children, user, logout }) {
    return (
        <div className="layout-container">
            <Sidebar user={user} logout={logout} />
            <div className="main-content">
                <Header user={user} />
                <main className="page-container">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default Layout;
