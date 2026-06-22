import { useState, useEffect } from "react";
import axios from "axios";
import { FiBell, FiAlertTriangle, FiCheckCircle, FiClock } from "react-icons/fi";

function Notifications() {
  const [requests, setRequests] = useState([]);

  const role = localStorage.getItem("role");
  const employeeName = localStorage.getItem("employeeName");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await axios.get("https://approval-management-system.onrender.com/requests");

    let filtered = res.data.filter((req) => req.notification);

    if (role === "employee") {
      filtered = filtered.filter((req) => req.employee_name === employeeName);
    }

    if (role === "manager") {
      filtered = filtered.filter(
        (req) =>
          req.assigned_approver === "Team Manager" ||
          req.assigned_approver === "Department Head"
      );
    }

    setRequests(filtered);
  };

  const getAlertIcon = (req) => {
    if (req.status === "Rejected") return <FiAlertTriangle />;
    if (req.predicted_delay >= 3) return <FiClock />;
    return <FiCheckCircle />;
  };

  const getAlertClass = (req) => {
    if (req.status === "Rejected") return "notification-card critical-alert";
    if (req.predicted_delay >= 3) return "notification-card warning-alert";
    return "notification-card success-alert";
  };

  const title =
    role === "employee"
      ? "My Notifications"
      : role === "manager"
      ? "Manager Alerts"
      : "System Notifications";

  const subtitle =
    role === "employee"
      ? "Updates about your submitted approval requests."
      : role === "manager"
      ? "Alerts for approval requests assigned to your level."
      : "System-wide alerts for approvals, delays, risk and routing.";

  return (
    <>
      <div className="header">
        <h2>Smart Alerts</h2>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="section">
        {requests.length === 0 ? (
          <div className="empty-state">
            <FiBell />
            <h2>No notifications available</h2>
            <p>New approval alerts will appear here automatically.</p>
          </div>
        ) : (
          <div className="notification-list">
            {requests.map((req) => (
              <div key={req.id} className={getAlertClass(req)}>
                <div className="notification-icon">
                  {getAlertIcon(req)}
                </div>

                <div className="notification-content">
                  <h3>Request #{req.id}</h3>

                  <p>
                    <strong>Employee:</strong> {req.employee_name}
                  </p>

                  <p>
                    <strong>Approver:</strong> {req.assigned_approver}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="mini-badge">{req.status}</span>
                  </p>

                  <p>
                    <strong>Alert:</strong> {req.notification}
                  </p>

                  {req.comment && (
                    <p>
                      <strong>Comment:</strong> {req.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Notifications;