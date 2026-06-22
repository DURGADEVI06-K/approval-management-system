import { useState, useEffect } from "react";
import axios from "axios";

function Requests() {
  const [requests, setRequests] = useState([]);

  const role = localStorage.getItem("role");
  const employeeName = localStorage.getItem("employeeName");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await axios.get("http://127.0.0.1:8000/requests");

    let filteredRequests = res.data;

    if (role === "employee") {
      filteredRequests = res.data.filter(
        (req) => req.employee_name === employeeName
      );
    }

    if (role === "manager") {
      filteredRequests = res.data.filter((req) =>
      req.assigned_approver.includes("Manager")
    );
  }
    setRequests(filteredRequests);
  };

  const updateStatus = async (id, status) => {
    const comment = prompt(`Enter comment for ${status}:`);

    await axios.put(`http://127.0.0.1:8000/requests/${id}/status`, {
  status: status,
  comment: comment || ""
  });

    fetchRequests();
  };

  const badgeClass = (value) => {
    if (value === "Approved") return "badge approved";
    if (value === "Rejected") return "badge rejected";
    return "badge pending";
  };

  return (
    <>
      <div className="header">
        <h1>
          {role === "employee"
            ? "My Requests"
            : role === "manager"
            ? "Assigned Requests"
            : "All Requests"}
        </h1>

        <p>
          {role === "employee"
            ? "View your submitted approval requests and current status."
            : role === "manager"
            ? "View and process requests assigned to your approval level."
            : "Track all requests, predictions, approvers and final decisions."}
        </p>
      </div>

      <div className="section">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Amount</th>
                <th>Approver</th>
                <th>Level</th>
                <th>Status</th>
                <th>Prediction</th>
                <th>Delay</th>
                <th>Comment</th>

                {(role === "manager" || role === "admin") && (
                  <th>Action</th>
                )}
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.id}</td>
                  <td>{req.employee_name}</td>
                  <td>{req.department}</td>
                  <td>{req.request_type}</td>
                  <td>{req.priority}</td>
                  <td>₹{req.amount}</td>
                  <td>{req.assigned_approver}</td>
                  <td>{req.approval_level}</td>

                  <td>
                    <span className={badgeClass(req.status)}>
                      {req.status}
                    </span>
                  </td>

                  <td>
                    <span className={badgeClass(req.predicted_result)}>
                      {req.predicted_result}
                    </span>
                  </td>

                  <td>{req.predicted_delay} day(s)</td>
                  <td>{req.comment || "No comment"}</td>

                  {(role === "manager" || role === "admin") && (
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => updateStatus(req.id, "Approved")}>
                          Approve
                        </button>

                        <button
                          onClick={() => updateStatus(req.id, "Rejected")}
                          style={{ background: "#dc2626" }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Requests;