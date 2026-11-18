
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GraduationCap, ShieldCheck, Eye, EyeOff } from "lucide-react";
import "./App.css";

function Login() {
  const [role, setRole] = useState("Student");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      if (response.data.user.role !== role.toLowerCase()) {
        alert("You selected the wrong login role!");
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login successful!");

      if (response.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="logo">
          <GraduationCap size={42} />
        </div>

        <h1>Exam Portal</h1>
        <p className="subtitle">
          Welcome back! Sign in to continue.
        </p>

        <div className="role-selector">
          <button
            className={role === "Student" ? "active" : ""}
            onClick={() => setRole("Student")}
            type="button"
          >
            <GraduationCap size={18} />
            Student
          </button>

          <button
            className={role === "Admin" ? "active" : ""}
            onClick={() => setRole("Admin")}
            type="button"
          >
            <ShieldCheck size={18} />
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="forgot">
            <a href="#forgot">Forgot Password?</a>
          </div>

          <button className="login-btn" type="submit">
            Sign In as {role}
          </button>
        </form>

        <p className="register">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

        <div className="footer">
          © 2026 Online Examination System
        </div>

      </div>
    </div>
  );
}

export default Login;
