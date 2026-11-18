
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  PlusCircle,
  LogOut,
  Clock,
  Award,
  X,
  HelpCircle
} from "lucide-react";
import "./App.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);

  const [results, setResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    duration: "",
    totalMarks: ""
  });

  const [questionData, setQuestionData] = useState({
    exam: "",
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    marks: 1
  });

  // Fetch Exams
  const fetchExams = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/exams",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setExams(response.data.exams || []);
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    }
  };

  // Fetch All Student Results
  const fetchResults = async () => {
    setResultsLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:5000/api/attempts/all-results",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setResults(response.data.results || []);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setResultsLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchResults();
  }, [token]);

  // Statistics
  const totalAttempts = results.length;

  const uniqueStudents = new Set(
    results
      .map((result) => result.student?._id)
      .filter(Boolean)
  );

  const totalStudents = uniqueStudents.size;

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Exam Form Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Create Exam
  const handleCreateExam = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/exams",
        {
          ...formData,
          duration: Number(formData.duration),
          totalMarks: Number(formData.totalMarks)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(response.data.message);

      setFormData({
        title: "",
        subject: "",
        description: "",
        duration: "",
        totalMarks: ""
      });

      setShowForm(false);
      await fetchExams();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Exam creation failed!"
      );
    } finally {
      setLoading(false);
    }
  };

  // Question Form Change
  const handleQuestionChange = (e) => {
    setQuestionData({
      ...questionData,
      [e.target.name]: e.target.value
    });
  };

  // MCQ Option Change
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...questionData.options];
    updatedOptions[index] = value;

    setQuestionData({
      ...questionData,
      options: updatedOptions
    });
  };

  // Add Question
  const handleAddQuestion = async (e) => {
    e.preventDefault();

    if (!questionData.exam) {
      alert("Please select an exam!");
      return;
    }

    if (questionData.options.some(option => !option.trim())) {
      alert("Please fill all four options!");
      return;
    }

    if (!questionData.correctAnswer) {
      alert("Please select the correct answer!");
      return;
    }

    setQuestionLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/questions",
        {
          ...questionData,
          marks: Number(questionData.marks)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(response.data.message);

      setQuestionData({
        exam: "",
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: 1
      });

      setShowQuestionForm(false);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Question adding failed!"
      );
    } finally {
      setQuestionLoading(false);
    }
  };

  return (
    <div className="admin-container">

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <GraduationCap size={32} />
          <h2>Exam Portal</h2>
        </div>

        <nav>
          <a href="#dashboard" className="admin-nav active">
            <LayoutDashboard size={19} /> Dashboard
          </a>

          <a href="#exams" className="admin-nav">
            <BookOpen size={19} /> Manage Exams
          </a>

          <a href="#students" className="admin-nav">
            <Users size={19} /> Students
          </a>

          <a href="#results" className="admin-nav">
            <ClipboardList size={19} /> Results
          </a>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          <LogOut size={19} /> Logout
        </button>
      </aside>

      {/* Main Dashboard */}
      <main className="admin-main">

        <header className="admin-topbar">
          <div>
            <h2>Admin Dashboard</h2>
            <p>Online Examination Management</p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">
              {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <span>{user?.fullName || "Admin"}</span>
          </div>
        </header>

        {/* Welcome */}
        <section id="dashboard" className="admin-welcome">
          <h1>Welcome, {user?.fullName || "Admin"}!</h1>
          <p>Manage your examination system from one place.</p>
        </section>

        {/* Statistics */}
        <section className="admin-stats">

          <div className="admin-stat-card">
            <BookOpen size={28} />
            <h3>Total Exams</h3>
            <p>{exams.length}</p>
          </div>

          <div className="admin-stat-card">
            <Users size={28} />
            <h3>Students Participated</h3>
            <p>{totalStudents}</p>
          </div>

          <div className="admin-stat-card">
            <ClipboardList size={28} />
            <h3>Exam Attempts</h3>
            <p>{totalAttempts}</p>
          </div>

          <div className="admin-stat-card">
            <Award size={28} />
            <h3>Results</h3>
            <p>{results.length}</p>
          </div>

        </section>

        {/* Manage Exams */}
        <section id="exams" className="admin-panel">

          <div className="admin-panel-header">
            <div>
              <h2>Manage Exams</h2>
              <p>Create and manage examinations.</p>
            </div>

            <button
              className="create-exam-btn"
              onClick={() => {
                setShowForm(!showForm);
                setShowQuestionForm(false);
              }}
            >
              {showForm ? <X size={18} /> : <PlusCircle size={18} />}
              {showForm ? "Close Form" : "Create Exam"}
            </button>
          </div>

          {/* Create Exam Form */}
          {showForm && (
            <form className="exam-form" onSubmit={handleCreateExam}>
              <h3>Create New Examination</h3>

              <label>Exam Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter exam title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <label>Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Enter subject name"
                value={formData.subject}
                onChange={handleChange}
                required
              />

              <label>Description</label>
              <textarea
                name="description"
                placeholder="Enter exam description"
                value={formData.description}
                onChange={handleChange}
              />

              <label>Duration (Minutes)</label>
              <input
                type="number"
                name="duration"
                min="1"
                placeholder="Example: 30"
                value={formData.duration}
                onChange={handleChange}
                required
              />

              <label>Total Marks</label>
              <input
                type="number"
                name="totalMarks"
                min="1"
                placeholder="Example: 50"
                value={formData.totalMarks}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="create-exam-btn"
                disabled={loading}
              >
                {loading ? "Creating..." : "Save Examination"}
              </button>
            </form>
          )}

          {/* Exam List */}
          {!showForm && (
            <div className="exam-list">
              {exams.length === 0 ? (
                <div className="admin-empty">
                  <BookOpen size={42} />
                  <h3>No Exams Created</h3>
                  <p>Create your first examination to get started.</p>
                </div>
              ) : (
                exams.map((exam) => (
                  <div className="exam-card" key={exam._id}>
                    <div>
                      <h3>{exam.title}</h3>
                      <p>Subject: {exam.subject}</p>
                      <p>Duration: {exam.duration} Minutes</p>
                      <p>Total Marks: {exam.totalMarks}</p>
                    </div>
                    <span className="exam-status">{exam.status}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Question Management */}
          <div className="admin-panel-header question-header">
            <div>
              <h2>
                <HelpCircle size={22} /> Question Management
              </h2>
              <p>Add MCQ questions to your examinations.</p>
            </div>

            <button
              className="create-exam-btn"
              disabled={exams.length === 0}
              onClick={() => {
                setShowQuestionForm(!showQuestionForm);
                setShowForm(false);
              }}
            >
              {showQuestionForm ? <X size={18} /> : <PlusCircle size={18} />}
              {showQuestionForm ? "Close Form" : "Add Question"}
            </button>
          </div>

          {showQuestionForm && (
            <form
              className="exam-form"
              onSubmit={handleAddQuestion}
            >
              <h3>Add New MCQ Question</h3>

              <label>Select Examination</label>
              <select
                name="exam"
                value={questionData.exam}
                onChange={handleQuestionChange}
                required
              >
                <option value="">Select an exam</option>

                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.title} - {exam.subject}
                  </option>
                ))}
              </select>

              <label>Question</label>
              <textarea
                name="questionText"
                placeholder="Enter your question"
                value={questionData.questionText}
                onChange={handleQuestionChange}
                required
              />

              <label>Option A</label>
              <input
                type="text"
                placeholder="Enter option A"
                value={questionData.options[0]}
                onChange={(e) => handleOptionChange(0, e.target.value)}
                required
              />

              <label>Option B</label>
              <input
                type="text"
                placeholder="Enter option B"
                value={questionData.options[1]}
                onChange={(e) => handleOptionChange(1, e.target.value)}
                required
              />

              <label>Option C</label>
              <input
                type="text"
                placeholder="Enter option C"
                value={questionData.options[2]}
                onChange={(e) => handleOptionChange(2, e.target.value)}
                required
              />

              <label>Option D</label>
              <input
                type="text"
                placeholder="Enter option D"
                value={questionData.options[3]}
                onChange={(e) => handleOptionChange(3, e.target.value)}
                required
              />

              <label>Correct Answer</label>
              <select
                name="correctAnswer"
                value={questionData.correctAnswer}
                onChange={handleQuestionChange}
                required
              >
                <option value="">Select correct answer</option>

                {questionData.options.map((option, index) => (
                  <option
                    key={index}
                    value={option}
                    disabled={!option.trim()}
                  >
                    {option
                      ? `Option ${String.fromCharCode(65 + index)}: ${option}`
                      : `Option ${String.fromCharCode(65 + index)} (empty)`}
                  </option>
                ))}
              </select>

              <label>Marks</label>
              <input
                type="number"
                name="marks"
                min="1"
                value={questionData.marks}
                onChange={handleQuestionChange}
                required
              />

              <button
                type="submit"
                className="create-exam-btn"
                disabled={questionLoading}
              >
                {questionLoading ? "Adding Question..." : "Save Question"}
              </button>
            </form>
          )}

        </section>

        {/* Students */}
        <section id="students" className="admin-panel">
          <h2>
            <Users size={22} />
            Student Management
          </h2>

          <div className="admin-empty">
            <Users size={42} />
            <p>
              {totalStudents} students have participated in examinations.
            </p>
          </div>
        </section>

        {/* Results */}
        <section id="results" className="admin-panel">

          <div className="admin-panel-header">
            <div>
              <h2>
                <Award size={22} />
                Examination Results
              </h2>
              <p>View all student examination results.</p>
            </div>

            <button
              className="create-exam-btn"
              onClick={fetchResults}
              disabled={resultsLoading}
            >
              {resultsLoading ? "Loading..." : "Refresh Results"}
            </button>
          </div>

          {resultsLoading ? (
            <div className="admin-empty">
              <p>Loading examination results...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="admin-empty">
              <Award size={42} />
              <h3>No Results Available</h3>
              <p>Student results will appear here after exam submission.</p>
            </div>
          ) : (
            <div className="admin-results-table">
              <table>
                <thead>
                  <tr>
                    <th>Sl No.</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Student ID</th>
                    <th>Exam Name</th>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Submission Date</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((result, index) => {
                    const percentage =
                      result.totalMarks > 0
                        ? (
                            (result.score / result.totalMarks) * 100
                          ).toFixed(2)
                        : "0.00";

                    return (
                      <tr key={result._id}>
                        <td>{index + 1}</td>
                        <td>{result.student?.fullName || "Unknown"}</td>
                        <td>{result.student?.email || "N/A"}</td>
                        <td>{result.student?.studentId || "N/A"}</td>
                        <td>{result.exam?.title || "Unknown Exam"}</td>
                        <td>{result.exam?.subject || "N/A"}</td>
                        <td>
                          {result.score} / {result.totalMarks}
                        </td>
                        <td>
                          <strong>{percentage}%</strong>
                        </td>
                        <td>
                          {result.submittedAt
                            ? new Date(result.submittedAt).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </section>

        <footer className="dashboard-footer">
          © 2026 Online Examination System
        </footer>

      </main>
    </div>
  );
}

export default AdminDashboard;
