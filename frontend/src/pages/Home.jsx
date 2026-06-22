import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <nav className="home-nav">
        <h2>ApprovalAI</h2>

        <Link to="/login">
          Login
        </Link>
      </nav>

      <section className="hero">
        <div>
          <h1>
            Smart Approval
            <br />
            Management System
          </h1>

          <p>
            Automate approval workflows, predict decisions using
            data science, identify delays and bottlenecks, and
            manage requests from one intelligent dashboard.
          </p>

          <Link to="/login">
            <button>Get Started</button>
          </Link>
        </div>

        <div className="hero-card">
          <h3>Why ApprovalAI?</h3>

          <p>⚡ Dynamic Approver Routing</p>
          <p>🤖 Random Forest Prediction</p>
          <p>📊 Approval Analytics</p>
          <p>🔔 Smart Notifications</p>
          <p>⏱ Delay Prediction</p>
        </div>
      </section>

      <section className="features">
        <div>
          <h3>Workflow Automation</h3>
          <p>
            Automatically routes requests to the appropriate
            approval level.
          </p>
        </div>

        <div>
          <h3>Prediction Engine</h3>
          <p>
            Uses machine learning to predict approval outcomes and
            expected delays.
          </p>
        </div>

        <div>
          <h3>Business Insights</h3>
          <p>
            Visualize workloads, bottlenecks and approval trends in
            real time.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;