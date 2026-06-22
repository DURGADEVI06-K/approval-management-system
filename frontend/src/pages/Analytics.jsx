import { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";

function Analytics() {
  const [dashboard, setDashboard] = useState(null);
  const [modelInsights, setModelInsights] = useState(null);

  useEffect(() => {
    fetchDashboard();
    fetchModelInsights();
  }, []);

  const fetchDashboard = async () => {
    const res = await axios.get("http://127.0.0.1:8000/dashboard");
    setDashboard(res.data);
  };

  const fetchModelInsights = async () => {
    const res = await axios.get("http://127.0.0.1:8000/model-insights");
    setModelInsights(res.data);
  };

  if (!dashboard || !modelInsights) {
    return <p>Loading analytics...</p>;
  }

  const approvalRate =
    dashboard.total_requests > 0
      ? ((dashboard.approved_predictions / dashboard.total_requests) * 100).toFixed(1)
      : 0;

  const rejectionRate =
    dashboard.total_requests > 0
      ? ((dashboard.rejected_predictions / dashboard.total_requests) * 100).toFixed(1)
      : 0;

  const predictionData = [
    { name: "Approved", value: dashboard.approved_predictions },
    { name: "Pending", value: dashboard.pending_predictions },
    { name: "Rejected", value: dashboard.rejected_predictions }
  ];

  const workloadData = [
    {
      name: "Manager",
      requests: dashboard.workload_distribution.team_manager
    },
    {
      name: "Dept Head",
      requests: dashboard.workload_distribution.department_head
    },
    {
      name: "Director",
      requests: dashboard.workload_distribution.director
    }
  ];

  const featureData = modelInsights.features.map((item) => ({
    feature: item.feature,
    importance: Number((item.importance * 100).toFixed(1))
  }));

  return (
    <>
      <div className="header">
        <h1>Analytics</h1>
        <p>Approval performance, delay insights, workload analysis and model insights.</p>
      </div>

      <div className="cards">
        <div className="card">
          <h3>Approval Rate</h3>
          <p>{approvalRate}%</p>
        </div>

        <div className="card">
          <h3>Rejection Rate</h3>
          <p>{rejectionRate}%</p>
        </div>

        <div className="card">
          <h3>Average Delay</h3>
          <p>{dashboard.average_predicted_delay}</p>
        </div>

        <div className="card">
          <h3>Total Requests</h3>
          <p>{dashboard.total_requests}</p>
        </div>
      </div>

      <div className="section">
        <h2>Prediction Distribution</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={predictionData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              <Cell fill="#16a34a" />
              <Cell fill="#f59e0b" />
              <Cell fill="#dc2626" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="section">
        <h2>Workload Distribution</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={workloadData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="requests" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="section">
        <h2>Model Insights</h2>

        <div className="cards">
          <div className="card">
            <h3>Model</h3>
            <p style={{ fontSize: "18px" }}>{modelInsights.model_name}</p>
          </div>

          <div className="card">
            <h3>Dataset Size</h3>
            <p>{modelInsights.dataset_size}</p>
          </div>

          <div className="card">
            <h3>Accuracy</h3>
            <p>{Math.round(modelInsights.accuracy * 100)}%</p>
          </div>
        </div>

        <h3>Feature Importance</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={featureData}>
            <XAxis dataKey="feature" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="importance" fill="#7c3aed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="section">
        <h2>Actionable Recommendations</h2>

        <p>
          {dashboard.average_predicted_delay >= 3
            ? "⚠ Approval delays are high. Add backup approvers or escalate high-value requests earlier."
            : "✅ Approval delay is under control."}
        </p>

        <p>
          {dashboard.workload_distribution.director > 0
            ? "⚠ Director has pending workload. Large-value requests may need delegation."
            : "✅ No heavy Director workload currently."}
        </p>

        <p>
          {approvalRate >= 60
            ? "✅ Approval success rate is healthy."
            : "⚠ Approval rate is low. Review request policies and rejection reasons."}
        </p>
      </div>
    </>
  );
}

export default Analytics;