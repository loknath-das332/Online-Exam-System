
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function StartExam() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Fetch exam and questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:5000/api/questions/${examId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setExam(response.data.exam);
        setQuestions(response.data.questions);
        setTimeLeft(response.data.exam.duration * 60);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load exam"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [examId]);

  // Submit exam
  const handleSubmit = async (autoSubmit = false) => {
    if (submitting || submitted) return;

    if (!autoSubmit) {
      const confirmed = window.confirm(
        "Are you sure you want to submit your exam?"
      );

      if (!confirmed) return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const formattedAnswers = questions.map((question) => ({
        questionId: question._id,
        selectedAnswer: answers[question._id] || ""
      }));

      const response = await axios.post(
        "http://localhost:5000/api/questions/submit",
        {
          examId,
          answers: formattedAnswers
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setResult(response.data.result);
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Exam submission failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (!exam || timeLeft <= 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, timeLeft, submitted]);

  // Auto submit when time ends
  useEffect(() => {
    if (exam && timeLeft === 0 && !submitted && !submitting) {
      handleSubmit(true);
    }
  }, [exam, timeLeft, submitted, submitting]);

  // Format timer
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // Select answer
  const handleAnswer = (questionId, option) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: option
    }));
  };

  if (loading) {
    return <h2>Loading exam...</h2>;
  }

  if (error && !submitted) {
    return (
      <div className="exam-error">
        <h2>{error}</h2>
        <button onClick={() => navigate("/student-dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Result screen
  if (submitted && result) {
    return (
      <div className="exam-page">
        <h1>Exam Submitted Successfully!</h1>

        <h2>{exam.title}</h2>

        <div className="exam-question-card">
          <h2>Your Result</h2>
          <h1>{result.score} / {result.totalMarks}</h1>
          <h3>Percentage: {result.percentage}%</h3>
        </div>

        <button onClick={() => navigate("/student-dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="exam-error">
        <h2>No questions found for this exam.</h2>
        <button onClick={() => navigate("/student-dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="exam-page">
      <div className="exam-header">
        <div>
          <h2>{exam.title}</h2>
          <p>{exam.subject}</p>
        </div>

        <div className="exam-timer">
          <span>Time Left</span>
          <h2>{formatTime(timeLeft)}</h2>
        </div>
      </div>

      <div className="exam-progress">
        Question {currentQuestion + 1} of {questions.length}
      </div>

      <div className="exam-question-card">
        <h3>
          Q{currentQuestion + 1}. {question.questionText}
        </h3>

        <div className="exam-options">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={
                answers[question._id] === option
                  ? "exam-option selected"
                  : "exam-option"
              }
            >
              <input
                type="radio"
                name={question._id}
                value={option}
                checked={answers[question._id] === option}
                onChange={() =>
                  handleAnswer(question._id, option)
                }
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div className="exam-navigation">
        <button
          disabled={currentQuestion === 0}
          onClick={() =>
            setCurrentQuestion((previous) => previous - 1)
          }
        >
          Previous
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={() =>
              setCurrentQuestion((previous) => previous + 1)
            }
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Exam"}
          </button>
        )}
      </div>

      <div className="exam-question-numbers">
        {questions.map((item, index) => (
          <button
            key={item._id}
            className={answers[item._id] ? "answered" : ""}
            onClick={() => setCurrentQuestion(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default StartExam;
