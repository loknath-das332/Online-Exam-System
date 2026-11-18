
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  ClipboardList,
  User,
  LogOut,
  Clock,
  Award,
  PlayCircle
} from "lucide-react";
import "./App.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Available Exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/exams/available",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setExams(response.data.exams);
        setError("");
      } catch (err) {
        console.error("Failed to fetch exams:", err);
        setError(
          err.response?.data?.message ||
          "Unable to load exams. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [token]);

  // Fetch Student Results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/attempts/my-results",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setResults(response.data.results);
      } catch (err) {
        console.error("Failed to fetch results:", err);
      } finally {
        setResultsLoading(false);
      }
    };

    fetchResults();
  }, [token]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Start Exam
  const handleStartExam = (exam) => {
    navigate(`/start-exam/${exam._id}`);
  };

  return (
    <div className="dashboard-container">

      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <GraduationCap size={32} />
          <h2>Exam Portal</h2>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </header>

      <main className="dashboard-content">

        {/* Welcome */}
        <div className="welcome-section">
          <h1>Welcome, {user?.fullName || "Student"}!</h1>
          <p>Ready to test your knowledge? Let's get started.</p>
        </div>

        {/* Statistics */}
        <div className="dashboard-stats">

          <div className="stat-card">
            <BookOpen size={28} />
            <h3>Available Exams</h3>
            <p>{exams.length}</p>
          </div>

          <div className="stat-card">
            <ClipboardList size={28} />
            <h3>Completed Exams</h3>
            <p>{results.length}</p>
          </div>

          <div className="stat-card">
            <Award size={28} />
            <h3>My Results</h3>
            <p>{results.length}</p>
          </div>

        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">

          {/* Available Exams */}
          <section className="dashboard-panel">
            <h2>
              <BookOpen size={22} />
              Available Exams
            </h2>

            {loading ? (
              <div className="empty-state">
                <p>Loading available exams...</p>
              </div>
            ) : error ? (
              <div className="empty-state">
                <p>{error}</p>
              </div>
            ) : exams.length === 0 ? (
              <div className="empty-state">
                <ClipboardList size={40} />
                <p>No exams available right now.</p>
                <span>New exams will appear here.</span>
              </div>
            ) : (
              <div className="student-exam-list">
                {exams.map((exam) => {
                  const alreadyAttempted = results.some(
                    (result) => result.exam?._id === exam._id
                  );

                  return (
                    <div className="student-exam-card" key={exam._id}>
                      <div className="student-exam-info">
                        <h3>{exam.title}</h3>

                        <p>
                          <strong>Subject:</strong> {exam.subject}
                        </p>

                        <p>
                          <Clock size={15} />
                          {exam.duration} Minutes
                        </p>

                        <p>
                          <Award size={15} />
                          {exam.totalMarks} Marks
                        </p>
                      </div>

                      <button
                        className="start-exam-btn"
                        disabled={alreadyAttempted}
                        onClick={() => handleStartExam(exam)}
                      >
                        <PlayCircle size={18} />
                        {alreadyAttempted ? "Completed" : "Start Exam"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Student Profile */}
          <section className="dashboard-panel">
            <h2>
              <User size={22} />
              Student Profile
            </h2>

            <div className="profile-details">
              <p>
                <strong>Name:</strong> {user?.fullName || "N/A"}
              </p>

              <p>
                <strong>Email:</strong> {user?.email || "N/A"}
              </p>

              <p>
                <strong>Role:</strong> Student
              </p>
            </div>
          </section>

        </div>

        {/* Recent Exam History */}
        <div className="dashboard-panel history-panel">
          <h2>
            <Clock size={22} />
            Recent Exam History
          </h2>

          {resultsLoading ? (
            <div className="empty-state">
              <p>Loading result history...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="empty-state">
              <p>You have not attempted any exams yet.</p>
            </div>
          ) : (
            <div className="result-history-list">
              {results.map((result) => (
                <div
                  className="student-exam-card"
                  key={result._id}
                >
                  <div className="student-exam-info">
                    <h3>{result.exam?.title || "Exam"}</h3>

                    <p>
                      <strong>Subject:</strong>{" "}
                      {result.exam?.subject || "N/A"}
                    </p>

                    <p>
                      <strong>Score:</strong>{" "}
                      {result.score} / {result.totalMarks}
                    </p>

                    <p>
                      <strong>Percentage:</strong>{" "}
                      {result.totalMarks > 0
                        ? (
                            (result.score / result.totalMarks) * 100
                          ).toFixed(2)
                        : "0.00"}%
                    </p>

                    <p>
                      <strong>Submitted:</strong>{" "}
                      {new Date(result.submittedAt).toLocaleString()}
                    </p>
                  </div>

                  <Award size={28} />
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      <footer className="dashboard-footer">
        © 2026 Online Examination System
      </footer>

    </div>
  );
}

export default StudentDashboard;
