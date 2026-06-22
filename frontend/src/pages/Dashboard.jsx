import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiTrendingUp,
  FiUsers,
  FiAlertTriangle
} from "react-icons/fi";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);

  const role = localStorage.getItem("role");
  const employeeName = localStorage.getItem("employeeName");

  useEffect(() => {
    fetchDashboard();
    fetchRequests();
  }, []);

  const fetchDashboard = async () => {
    const res = await axios.get("http://127.0.0.1:8000/dashboard");
    setDashboard(res.data);
  };

  const fetchRequests = async () => {
    const res = await axios.get("http://127.0.0.1:8000/requests");
    setRequests(res.data);
  };

  if (!dashboard) {
    return <p>Loading dashboard...</p>;
  }

  const employeeRequests = requests.filter(
    (req) => req.employee_name === employeeName
  );

  const managerRequests = requests.filter((req) =>
  req.assigned_approver.includes("Manager")
  );

  const data =
    role === "employee"
      ? employeeRequests
      : role === "manager"
      ? managerRequests
      : requests;

  const total = data.length;
  const approved = data.filter((r) => r.status === "Approved").length;
  const pending = data.filter((r) => r.status === "Pending").length;
  const rejected = data.filter((r) => r.status === "Rejected").length;

  const welcomeName =
    role === "employee"
      ? "Durga"
      : role === "manager"
      ? "Manager"
      : "Admin";

  const subtitle =
    role === "employee"
      ? "Track and manage your own approval requests."
      : role === "manager"
      ? "Review and process requests assigned to your approval level."
      : "Monitor workflows, analytics, approvals and system performance.";

  return (
    <>
      <div className="header">
        <h2>Welcome back, {welcomeName} 👋</h2>
        <h1>
          {role === "employee"
            ? "Employee Dashboard"
            : role === "manager"
            ? "Manager Dashboard"
            : "Admin Dashboard"}
        </h1>
        <p>{subtitle}</p>
      </div>

      <div className="cards">
        <div className="card kpi-card">
          <FiFileText className="card-icon" />
          <h3>
            {role === "employee"
              ? "My Requests"
              : role === "manager"
              ? "Assigned Requests"
              : "Total Requests"}
          </h3>
          <p>{total}</p>
          <span>
            {role === "employee"
              ? "Requests submitted by you"
              : role === "manager"
              ? "Requests assigned to you"
              : "All submitted requests"}
          </span>
        </div>

        <div className="card kpi-card">
          <FiCheckCircle className="card-icon success-icon" />
          <h3>Approved</h3>
          <p>{approved}</p>
          <span>Successfully approved</span>
        </div>

        <div className="card kpi-card">
          <FiClock className="card-icon warning-icon" />
          <h3>Pending</h3>
          <p>{pending}</p>
          <span>Needs attention</span>
        </div>

        <div className="card kpi-card">
          <FiXCircle className="card-icon danger-icon" />
          <h3>Rejected</h3>
          <p>{rejected}</p>
          <span>Rejected requests</span>
        </div>

        {role === "admin" && (
          <>
            <div className="card kpi-card">
              <FiTrendingUp className="card-icon purple-icon" />
              <h3>Avg Delay</h3>
              <p>{dashboard.average_predicted_delay}</p>
              <span>Predicted days</span>
            </div>

            <div className="card kpi-card">
              <FiAlertTriangle className="card-icon warning-icon" />
              <h3>Bottleneck</h3>
              <p>{dashboard.bottleneck_department}</p>
              <span>Avg Delay: {dashboard.bottleneck_delay} day(s)</span>
            </div>
          </>
        )}
      </div>

      {role === "manager" && (
        <div className="section">
          <h2>
            <FiClock /> Requests Awaiting Approval
          </h2>
          <p>
            You currently have <strong>{pending}</strong> pending request(s) to
            review.
          </p>
        </div>
      )}

      {role === "admin" && (
        <div className="section">
          <h2>
            <FiUsers /> Workload Distribution
          </h2>

          <div className="workload-grid">
            <div>
              <h3>Team Manager</h3>
              <p>{dashboard.workload_distribution.team_manager} requests</p>
            </div>

            <div>
              <h3>Department Head</h3>
              <p>{dashboard.workload_distribution.department_head} requests</p>
            </div>

            <div>
              <h3>Director</h3>
              <p>{dashboard.workload_distribution.director} requests</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;