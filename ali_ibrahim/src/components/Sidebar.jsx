import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBook,
  FaClipboardList,
  FaUser,
  FaChartPie,
  FaUsers,
  FaProjectDiagram,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUserShield,
  FaUserGraduate,
  FaChalkboardTeacher
} from "react-icons/fa";

function Sidebar({ user, logout }) {
  const [isRetracted, setIsRetracted] = useState(false);

  return (
    <aside className={`app-sidebar ${isRetracted ? "retracted" : ""}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setIsRetracted(!isRetracted)}
        title={isRetracted ? "Expand" : "Collapse"}
      >
        {isRetracted ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      <div>
        {!isRetracted && <h3>Menu</h3>}
        <nav className="nav-links">
          {user?.role === "student" && (
            <>
              <Link className="nav-link" title="Courses" to="/student/studentcourses">
                <FaBook /> {!isRetracted && <span>Courses</span>}
              </Link>
              <Link className="nav-link" title="Attendance" to="/student/studentattendance">
                <FaClipboardList /> {!isRetracted && <span>Attendance</span>}
              </Link>
              <Link className="nav-link" title="Profile" to="/student/studentsettings">
                <FaUser /> {!isRetracted && <span>Profile</span>}
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link className="nav-link" title="Dashboard" to="/admin">
                <FaUserShield /> {!isRetracted && <span>Dashboard</span>}
              </Link>
              <Link className="nav-link" title="Students" to="/admin/students">
                <FaUserGraduate /> {!isRetracted && <span>Students</span>}
              </Link>
              <Link className="nav-link" title="Teachers" to="/admin/teachers">
                <FaChalkboardTeacher /> {!isRetracted && <span>Teachers</span>}
              </Link>
            </>
          )}

          {user?.role === "teacher" && (
            <>
              <Link className="nav-link" title="Dashboard" to="/teacher/dashboard">
                <FaChartPie /> {!isRetracted && <span>Dashboard</span>}
              </Link>
              <Link className="nav-link" title="Classes" to="/teacher/classes">
                <FaUsers /> {!isRetracted && <span>Classes</span>}
              </Link>
              <Link className="nav-link" title="Projects" to="/teacher/projects">
                <FaProjectDiagram /> {!isRetracted && <span>Projects</span>}
              </Link>
            </>
          )}
        </nav>
      </div>

      <div className="sidebar-footer">
        {/* logout clears the token from localStorage and sends the user back to login */}
        <button
          onClick={logout}
          className="btn btn-logout nav-link"
          title="Logout"
          style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
        >
          <FaSignOutAlt /> {!isRetracted && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
