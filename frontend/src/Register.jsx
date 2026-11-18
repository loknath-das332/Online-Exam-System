
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import "./App.css";

function Register() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const fullName = e.target.fullName.value.trim();
    const email = e.target.email.value.trim();
    const phone = e.target.phone.value.trim();
    const studentId = e.target.studentId.value.trim();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          fullName,
          email,
          phone,
          studentId,
          password
        }
      );

      alert(response.data.message);
      navigate("/");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="logo">
          <GraduationCap size={42} />
        </div>

        <h1>Create Account</h1>

        <p className="subtitle">
          Register to start your examination journey.
        </p>

        <form onSubmit={handleRegister}>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />

          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter 10 digit phone number"
            pattern="[0-9]{10}"
            required
          />

          <label>Student ID</label>
          <input
            type="text"
            name="studentId"
            placeholder="Enter your student ID"
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={6}
            required
          />

          <button className="login-btn" type="submit">
            Create Account
          </button>
        </form>

        <p className="register">
          Already have an account? <Link to="/">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;
