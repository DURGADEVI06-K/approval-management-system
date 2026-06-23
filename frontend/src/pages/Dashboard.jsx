import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiTrendingUp,
  FiUsers,
  FiAlertTriangle,
  FiActivity
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
    const res = await axios.get("https://approval-management-system.onrender.com/dashboard");
    setDashboard(res.data);
  };

  const fetchRequests = async () => {
    const res = await axios.get("https://approval-management-system.onrender.com/requests");
    setRequests(res.data);
  };

  if (!dashboard) {
    return <p>Loading dashboard...</p>;
  }

  const employeeRequests = requests.filter(
    (req) => req.employee_name === employeeName
  );

  const managerRequests = requests.filter((req) =>
    req.assigned_approver?.includes("Manager")
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

  const smartMessage =
    role === "employee"
      ? `You have ${pending} request(s) waiting for approval.`
      : role === "manager"
      ? `You have ${pending} request(s) awaiting your review.`
      : `${pending} request(s) require attention today.`;

  return (
    <>
      <div className="header compact-header">
        <div>
          <h2>Good Evening, {welcomeName} 👋</h2>
          <h1>
            {role === "employee"
              ? "Employee Dashboard"
              : role === "manager"
              ? "Manager Dashboard"
              : "Admin Dashboard"}
          </h1>
          <p>{smartMessage}</p>
        </div>

        <div className="banner-stats">
          <span>✅ Approved: {approved}</span>
          <span>⏳ Pending: {pending}</span>
          {role === "admin" && (
            <span>📊 Bottleneck: {dashboard.bottleneck_department}</span>
          )}
        </div>
      </div>

      <div className="cards">
        <div className="card kpi-card dashboard-card">
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
              : "Across all departments"}
          </span>
        </div>

        <div className="card kpi-card dashboard-card">
          <FiCheckCircle className="card-icon success-icon" />
          <h3>Approved</h3>
          <p>{approved}</p>
          <span>Processed successfully</span>
        </div>

        <div className="card kpi-card dashboard-card">
          <FiClock className="card-icon warning-icon" />
          <h3>Pending</h3>
          <p>{pending}</p>
          <span>Awaiting approvals</span>
        </div>

        <div className="card kpi-card dashboard-card">
          <FiXCircle className="card-icon danger-icon" />
          <h3>Rejected</h3>
          <p>{rejected}</p>
          <span>Closed requests</span>
        </div>

        {role === "admin" && (
          <>
            <div className="card kpi-card dashboard-card">
              <FiTrendingUp className="card-icon purple-icon" />
              <h3>Avg Delay</h3>
              <p>{dashboard.average_predicted_delay}</p>
              <span>Predicted processing time</span>
            </div>

            <div className="card kpi-card dashboard-card">
              <FiAlertTriangle className="card-icon warning-icon" />
              <h3>Bottleneck</h3>
              <p>{dashboard.bottleneck_department}</p>
              <span>Department needing attention</span>
            </div>
          </>
        )}
      </div>

      <div className="dashboard-lower-grid">
        <div className="section chart-card">
          <h2>
            <FiActivity /> Approval Status Overview
          </h2>

          <div className="simple-chart">
            <div className="chart-row">
              <span>Approved</span>
              <div className="chart-track">
                <div
                  className="chart-fill approved-fill"
                  style={{ width: `${total ? (approved / total) * 100 : 0}%` }}
                ></div>
              </div>
              <strong>{approved}</strong>
            </div>

            <div className="chart-row">
              <span>Pending</span>
              <div className="chart-track">
                <div
                  className="chart-fill pending-fill"
                  style={{ width: `${total ? (pending / total) * 100 : 0}%` }}
                ></div>
              </div>
              <strong>{pending}</strong>
            </div>

            <div className="chart-row">
              <span>Rejected</span>
              <div className="chart-track">
                <div
                  className="chart-fill rejected-fill"
                  style={{ width: `${total ? (rejected / total) * 100 : 0}%` }}
                ></div>
              </div>
              <strong>{rejected}</strong>
            </div>
          </div>
        </div>

        <div className="section activity-card">
          <h2>Recent Activity</h2>

          <ul className="activity-list">
            {data.slice(-4).reverse().map((req) => (
              <li key={req.id}>
                <span
                  className={
                    req.status === "Approved"
                      ? "activity-dot green-dot"
                      : req.status === "Rejected"
                      ? "activity-dot red-dot"
                      : "activity-dot yellow-dot"
                  }
                ></span>
                <div>
                  <strong>{req.request_type}</strong>
                  <p>
                    {req.employee_name} • {req.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
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