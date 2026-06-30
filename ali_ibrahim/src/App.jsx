import { useState, useEffect, useRef, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Login from './Pages/Login'
import Studenthomepage from './Pages/Studenthomepage'
import Teacherhomepage from './Pages/Teacherhomepage'
import Adminhomepage from './Pages/Adminhomepage'
import Layout from './components/Layout'
import Studentattendance from './Pages/student pages/studentattendance'
import StudentCourses from './Pages/student pages/studentCourses'
import Studentsettings from './Pages/student pages/studentsettings'
import Classes from './Pages/teacher pages/classes'
import Dashboard from './Pages/teacher pages/dashboard'
import Projects from './Pages/teacher pages/projects'
import ManageStudents from './Pages/admin pages/manageStudents'
import ManageTeachers from './Pages/admin pages/manageTeachers'

// if the user has no mouse/keyboard activity for this long, we log them out automatically
const INACTIVITY_LIMIT = 60 * 60 * 1000; // 1 hour in ms

// AppRoutes is a child of BrowserRouter so it can call useNavigate
function AppRoutes() {
  const navigate = useNavigate();

  // on first load, try to restore a previous session from localStorage
  const [user, setuser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const timerRef = useRef(null);

  const logout = useCallback(() => {
    setuser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  }, [navigate]);

  // restart the 1-hour countdown every time the user interacts with the page
  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, INACTIVITY_LIMIT);
  }, [logout]);

  useEffect(() => {
    if (!user) return; // only track activity when someone is logged in

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer(); // kick off the first countdown

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearTimeout(timerRef.current);
    };
  }, [user, resetTimer]);

  // call this at login — persists session to localStorage and normalises the role to lowercase
  const saveUser = (userData) => {
    const normalized = { ...userData, role: userData.role.toLowerCase() };
    setuser(normalized);
    localStorage.setItem('user', JSON.stringify(normalized));
    localStorage.setItem('token', userData.token);
  };

  // helper so we don't repeat the auth guard on every route
  const protect = (component) => user ? component : <Login setuser={saveUser} />;

  return (
    <Routes>
      <Route path="/" element={<Login setuser={saveUser} user={user} />} />

      <Route path="/student"
        element={protect(<Layout user={user} logout={logout}><Studenthomepage user={user} /></Layout>)} />
      <Route path="/student/studentattendance"
        element={protect(<Layout user={user} logout={logout}><Studentattendance /></Layout>)} />
      <Route path="/student/studentcourses"
        element={protect(<Layout user={user} logout={logout}><StudentCourses user={user} /></Layout>)} />
      <Route path="/student/studentsettings"
        element={protect(<Layout user={user} logout={logout}><Studentsettings user={user} /></Layout>)} />

      <Route path="/teacher"
        element={protect(<Layout user={user} logout={logout}><Teacherhomepage user={user} /></Layout>)} />
      <Route path="/teacher/classes"
        element={protect(<Layout user={user} logout={logout}><Classes user={user} /></Layout>)} />
      <Route path="/teacher/dashboard"
        element={protect(<Layout user={user} logout={logout}><Dashboard /></Layout>)} />
      <Route path="/teacher/projects"
        element={protect(<Layout user={user} logout={logout}><Projects /></Layout>)} />

      <Route path="/admin"
        element={protect(<Layout user={user} logout={logout}><Adminhomepage user={user} /></Layout>)} />
      <Route path="/admin/students"
        element={protect(<Layout user={user} logout={logout}><ManageStudents /></Layout>)} />
      <Route path="/admin/teachers"
        element={protect(<Layout user={user} logout={logout}><ManageTeachers /></Layout>)} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App
