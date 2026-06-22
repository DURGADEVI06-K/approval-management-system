import { useState } from "react";
import axios from "axios";

function SubmitRequest() {
  const [formData, setFormData] = useState({
    employee_name: "",
    department: "",
    request_type: "",
    priority: "",
    amount: ""
  });

  const [response, setResponse] = useState(null);

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
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <div className="header">
        <h1>Submit Approval Request</h1>
        <p>Create a new approval request and get prediction insights.</p>
      </div>

      <div className="section">
        <div className="form-grid">
          <input name="employee_name" placeholder="Employee Name" onChange={handleChange} />
          <select name="department" onChange={handleChange}>
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
            <option value="Sales">Sales</option>
          </select>

          <select name="request_type" onChange={handleChange}>
            <option value="">Select Request Type</option>
            <option value="Purchase">Purchase</option>
            <option value="Travel">Travel</option>
            <option value="Leave">Leave</option>
            <option value="Reimbursement">Reimbursement</option>
            <option value="Software Access">Software Access</option>
            <option value="Content Approval">Content Approval</option>
          </select>

          <select name="priority" onChange={handleChange}>
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input name="amount" type="number" placeholder="Amount" onChange={handleChange} />
        </div>

        <button onClick={handleSubmit}>Submit Request</button>
      </div>

      {response && (
        <div className="section">
          <h2>Prediction Result</h2>
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
    </>
  );
}

export default SubmitRequest;