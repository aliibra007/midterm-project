import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import "../css/login.css";

function Login({ setuser, user }) {
    const [useremail, setuseremail] = useState("");
    const [userpassword, setuserpassword] = useState("");
    const [error, seterror] = useState("");
    const [loading, setloading] = useState(false);
    const nav = useNavigate();

    function HandleChange(e) {
        const { name, value } = e.target;
        if (name === "email") setuseremail(value);
        else if (name === "password") setuserpassword(value);
    }

    async function Handlelogin(e) {
        e.preventDefault();

        let errormsg = "";
        if (!useremail) errormsg += "Missing email. ";
        if (!userpassword) errormsg += "Missing password.";
        if (errormsg) { seterror(errormsg); return; }

        setloading(true);
        seterror("");

        try {
            const res = await login(useremail, userpassword);
            const data = await res.json();

            if (!res.ok) {
                seterror(data.message || "Invalid email or password");
                return;
            }

            // setuser handles localStorage + role normalisation
            setuser(data);

            const role = data.role.toLowerCase();
            if (role === "student") nav("/student");
            else if (role === "teacher") nav("/teacher");
            else nav("/admin");

        } catch {
            seterror("Could not reach the server. Please try again in a moment.");
        } finally {
            setloading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Welcome Back</h2>
                <p className="subtitle">Please enter your credentials to access the portal.</p>
                <form onSubmit={Handlelogin}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            onChange={HandleChange}
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            onChange={HandleChange}
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default Login;
