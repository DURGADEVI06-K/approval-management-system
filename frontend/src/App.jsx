import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import {
  FiGrid,
  FiEdit3,
  FiFileText,
  FiBarChart2,
  FiBell,
  FiLogOut
} from "react-icons/fi";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SubmitRequest from "./pages/SubmitRequest";
import Requests from "./pages/Requests";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";

function Layout() {
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    const role = localStorage.getItem("role");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>ApprovalAI</h2>

        <p className="role-label">
          Logged in as: {role ? role.toUpperCase() : "GUEST"}
        </p>

        <NavLink to="/dashboard">
          <FiGrid /> Dashboard
        </NavLink>

        {role === "employee" && (
        <NavLink to="/submit">
        <FiEdit3 /> Submit Request
        </NavLink>
      )}

        <NavLink to="/requests">
        <FiFileText />
        {role === "employee"
        ? " My Requests"
        : role === "manager"
        ? " Requests"
        : " All Requests"}
        </NavLink>

        {role === "admin" && (
          <NavLink to="/analytics">
            <FiBarChart2 /> Analytics
          </NavLink>
        )}

        <NavLink to="/notifications">
          <FiBell /> Notifications
        </NavLink>

        <NavLink to="/" onClick={handleLogout}>
          <FiLogOut /> Logout
        </NavLink>
      </aside>

      <main className="main">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/submit" element={<SubmitRequest />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;