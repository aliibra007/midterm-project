// All API calls live here so we only have one place to update the base URL or headers

// VITE_API_URL is set in .env for local dev and in the Vercel dashboard for production
const BASE = import.meta.env.VITE_API_URL;

const token = () => localStorage.getItem("token");

// attach the JWT to every authenticated request
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

// ── Auth ──────────────────────────────────────────────────────────────────────

export const login = (email, password) =>
  fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

export const registerStudent = (data) =>
  fetch(`${BASE}/auth/register/student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const registerTeacher = (data) =>
  fetch(`${BASE}/auth/register/teacher`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// ── Student ───────────────────────────────────────────────────────────────────

export const getStudentMe = () =>
  fetch(`${BASE}/student/me`, { headers: authHeaders() });

export const updateStudentMe = (data) =>
  fetch(`${BASE}/student/me`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

export const getAllStudents = () =>
  fetch(`${BASE}/student`, { headers: authHeaders() });

export const getStudentById = (id) =>
  fetch(`${BASE}/student/${id}`, { headers: authHeaders() });

export const deleteStudent = (id) =>
  fetch(`${BASE}/student/${id}`, { method: "DELETE", headers: authHeaders() });

// ── Teacher ───────────────────────────────────────────────────────────────────

export const getTeacherMe = () =>
  fetch(`${BASE}/teacher/me`, { headers: authHeaders() });

export const updateTeacherMe = (data) =>
  fetch(`${BASE}/teacher/me`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

// ── Classes ───────────────────────────────────────────────────────────────────

export const getMyClasses = () =>
  fetch(`${BASE}/class/my`, { headers: authHeaders() });

export const getAllClasses = () =>
  fetch(`${BASE}/class`, { headers: authHeaders() });

export const getClassById = (id) =>
  fetch(`${BASE}/class/${id}`, { headers: authHeaders() });

export const createClass = (data) =>
  fetch(`${BASE}/class`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

export const updateClass = (id, data) =>
  fetch(`${BASE}/class/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

export const deleteClass = (id) =>
  fetch(`${BASE}/class/${id}`, { method: "DELETE", headers: authHeaders() });

export const enrollInClass = (classId) =>
  fetch(`${BASE}/class/${classId}/enroll`, {
    method: "POST",
    headers: authHeaders(),
  });

export const removeStudentFromClass = (classId, studentId) =>
  fetch(`${BASE}/class/${classId}/remove/${studentId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

export const getClassStudents = (classId) =>
  fetch(`${BASE}/class/${classId}/students`, { headers: authHeaders() });

// ── Admin ─────────────────────────────────────────────────────────────────────

export const getAdminStats = () =>
  fetch(`${BASE}/admin/stats`, { headers: authHeaders() });

export const adminGetStudents = () =>
  fetch(`${BASE}/admin/students`, { headers: authHeaders() });

export const adminCreateStudent = (data) =>
  fetch(`${BASE}/admin/students`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

export const adminDeleteStudent = (id) =>
  fetch(`${BASE}/admin/students/${id}`, { method: "DELETE", headers: authHeaders() });

export const adminGetTeachers = () =>
  fetch(`${BASE}/admin/teachers`, { headers: authHeaders() });

export const adminCreateTeacher = (data) =>
  fetch(`${BASE}/admin/teachers`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

export const adminDeleteTeacher = (id) =>
  fetch(`${BASE}/admin/teachers/${id}`, { method: "DELETE", headers: authHeaders() });
