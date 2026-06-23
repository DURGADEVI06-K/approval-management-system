import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiUser, FiArrowRight, FiShield } from "react-icons/fi";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const getUsers = () => {
    const demoUsers = {
      employee: { password: "emp123", role: "employee", employeeName: "Durga" },
      manager: { password: "manager123", role: "manager" },
      admin: { password: "admin123", role: "admin" }
    };

    const savedUsers = JSON.parse(localStorage.getItem("customUsers")) || {};
    return { ...demoUsers, ...savedUsers };
  };

  const handleLogin = () => {
    const users = getUsers();

    if (users[username] && users[username].password === password) {
      localStorage.setItem("role", users[username].role);
      localStorage.setItem("username", username);

      if (users[username].employeeName) {
        localStorage.setItem("employeeName", users[username].employeeName);
      }

      navigate("/dashboard");
    } else {
      alert("Invalid login details.");
    }
  };

  const handleCreateAccount = () => {
    const newUsername = prompt("Enter new employee username:");
    if (!newUsername) return;

    const newPassword = prompt("Enter password:");
    if (!newPassword) return;

    const employeeName = prompt("Enter employee name:");
    if (!employeeName) return;

    const savedUsers = JSON.parse(localStorage.getItem("customUsers")) || {};

    savedUsers[newUsername] = {
      password: newPassword,
      role: "employee",
      employeeName: employeeName
    };

    localStorage.setItem("customUsers", JSON.stringify(savedUsers));

    alert("Employee account created successfully. You can now login.");
  };

  const handleForgotPassword = () => {
    const enteredUsername = prompt("Enter your username:");
    if (!enteredUsername) return;

    const users = getUsers();

    if (users[enteredUsername]) {
      alert(`Password for ${enteredUsername}: ${users[enteredUsername].password}`);
    } else {
      alert("Username not found.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <FiShield />
        </div>

        <h1>Welcome to ApprovalAI</h1>
        <p>Sign in to access your approval workspace.</p>

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

        <div className="login-links">
          <button type="button" onClick={handleForgotPassword}>
            Forgot password?
          </button>

          <button type="button" onClick={handleCreateAccount}>
            Create account
          </button>
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