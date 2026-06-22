import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiUser, FiArrowRight, FiShield } from "react-icons/fi";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const users = {
    employee: { password: "emp123", role: "employee", employeeName: "Durga" },
    manager: { password: "manager123", role: "manager" },
    admin: { password: "admin123", role: "admin" }
  };

    if (users[username] && users[username].password === password) {
      localStorage.setItem("role", users[username].role);
      localStorage.setItem("username", username);
      if (users[username].employeeName) {
        localStorage.setItem("employeeName", users[username].employeeName);
      }
      navigate("/dashboard");
    } else {
      alert("Invalid login. Try employee/emp123, manager/manager123, or admin/admin123");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <FiShield />
        </div>

        <h1>Welcome Back</h1>
        <p>Sign in to continue to <strong>ApprovalAI</strong></p>

        <div className="input-group">
          <FiUser />
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FiLock />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={handleLogin}>
          Login <FiArrowRight />
        </button>

        <div className="demo-box">
          <p>Demo Credentials</p>
          <span>employee / emp123</span><br />
          <span>manager / manager123</span><br />
          <span>admin / admin123</span>
        </div>
      </div>
    </div>
  );
}

export default Login;