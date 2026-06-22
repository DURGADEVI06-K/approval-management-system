import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    employee_name: "",
    department: "",
    request_type: "",
    priority: "",
    amount: ""
  });

  const [response, setResponse] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/submit-request", {
        ...formData,
        amount: Number(formData.amount)
      });

      setResponse(res.data);
      fetchDashboard();
      fetchRequests();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const badgeClass = (value) => {
    if (value === "Approved") return "badge approved";
    if (value === "Rejected") return "badge rejected";
    return "badge pending";
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Approval System</h2>
        <p>Dashboard</p>
        <p>Submit Request</p>
        <p>All Requests</p>
        <p>Analytics</p>
        <p>Notifications</p>
      </aside>

      <main className="main">
        <div className="header">
          <h1>Approval Management System</h1>
          <p>Automated workflow routing, prediction, analytics and decision support</p>
        </div>

        {dashboard && (
          <div className="cards">
            <div className="card">
              <h3>Total Requests</h3>
              <p>{dashboard.total_requests}</p>
            </div>

            <div className="card">
              <h3>Approved</h3>
              <p>{dashboard.approved_predictions}</p>
            </div>

            <div className="card">
              <h3>Pending</h3>
              <p>{dashboard.pending_predictions}</p>
            </div>

            <div className="card">
              <h3>Rejected</h3>
              <p>{dashboard.rejected_predictions}</p>
            </div>

            <div className="card">
              <h3>Avg Delay</h3>
              <p>{dashboard.average_predicted_delay}</p>
            </div>
          </div>
        )}

        {dashboard && (
          <div className="section">
            <h2>Workload Distribution</h2>
            <p>Team Manager: {dashboard.workload_distribution.team_manager}</p>
            <p>Department Head: {dashboard.workload_distribution.department_head}</p>
            <p>Director: {dashboard.workload_distribution.director}</p>
          </div>
        )}

        <div className="section">
          <h2>Submit Approval Request</h2>

          <div className="form-grid">
            <input
              name="employee_name"
              placeholder="Employee Name"
              onChange={handleChange}
            />

            <input
              name="department"
              placeholder="Department"
              onChange={handleChange}
            />

            <input
              name="request_type"
              placeholder="Request Type"
              onChange={handleChange}
            />

            <input
              name="priority"
              placeholder="Priority"
              onChange={handleChange}
            />

            <input
              name="amount"
              type="number"
              placeholder="Amount"
              onChange={handleChange}
            />
          </div>

          <button onClick={handleSubmit}>Submit Request</button>

          {response && (
            <div className="section" style={{ marginTop: "20px" }}>
              <h3>Prediction Result</h3>
              <p>Request ID: {response.request_id}</p>
              <p>Status: {response.status}</p>
              <p>Assigned Approver: {response.assigned_approver}</p>
              <p>Approval Level: {response.approval_level}</p>
              <p>Predicted Result: {response.predicted_result}</p>
              <p>Predicted Delay: {response.predicted_delay} day(s)</p>
              <p>Reason: {response.reason}</p>
              <p>Notification: {response.notification}</p>
            </div>
          )}
        </div>

        <div className="section">
          <h2>All Requests</h2>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Amount</th>
                <th>Prediction</th>
                <th>Delay</th>
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
                  <td>
                    <span className={badgeClass(req.predicted_result)}>
                      {req.predicted_result}
                    </span>
                  </td>
                  <td>{req.predicted_delay} day(s)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;