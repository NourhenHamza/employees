import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewTest = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/tests/${id}`)
      .then((response) => setQuiz(response.data))
      .catch((error) => console.error("Error fetching quiz details:", error));
  }, [id]);

  if (!quiz) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.quizCard}>
        <h1 style={styles.quizTitle}>Quiz: {quiz.testName}</h1>
        <div style={styles.infoSection}>
          <h3 style={styles.sectionSubtitle}>Quiz Information</h3>
          <p><strong>Test ID:</strong> {quiz.testID}</p>
          <p><strong>Created By:</strong> {quiz.createdBy}</p>
          <p><strong>Created At:</strong> {quiz.createdAt}</p>

          <p><strong>Duration:</strong> {quiz.testDuration}</p>
          <p><strong>Status:</strong> {quiz.status}</p>

        </div>
        
        <h2 style={styles.sectionTitle}>Questions</h2>
        <div style={styles.questionsContainer}>
          {quiz.questions.map((question, index) => (
            <div key={index} style={styles.questionBlock}>
              <p style={styles.questionText}><strong>Question {index + 1}:</strong> {question.quesText}</p>
              <ul style={styles.optionsList}>
                {question.options.map((option, idx) => (
                  <li
                    key={idx}
                    style={{
                      ...styles.optionItem,
                      ...(String(idx + 1) === quiz.anskey[index] ? styles.correctAnswer : {}),
                    }}
                  >
                    {/* Check if option is an object with `name` (like an image option) or a string */}
                    {typeof option === "string" ? (
                      option
                    ) : (
                      option.name || "Option with image"
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div style={styles.securitySection}>
          <h3 style={styles.sectionSubtitle}>Security Options</h3>
          <ul style={styles.securityList}>
            <li>Camera & Audio Proctoring: {quiz.security[0] ? "Enabled" : "Disabled"}</li>
            <li>Full Screen Mode: {quiz.security[1] ? "Enabled" : "Disabled"}</li>
            <li>Tab Switch Detection: {quiz.security[2] ? "Enabled" : "Disabled"}</li>
          </ul>
        </div>

        <div style={styles.tookBySection}>
  <h3 style={styles.sectionSubtitle}>Took By</h3>
  {quiz.tookBy.length > 0 ? (
    <ul>
      {quiz.tookBy.map((userToken, index) => {
        // Split the token (e.g., "sousa/0/1" -> ["sousa", "0", "1"])
        const [userName, correctAnswers, totalAnswers] = userToken.split("/");

        // Calculate the percentage
        const scorePercentage = ((parseInt(correctAnswers) / parseInt(totalAnswers)) * 100).toFixed(2);

        return (
          <li key={index} style={styles.tookByUser}>
            {userName} - {scorePercentage}% Correct
          </li>
        );
      })}
    </ul>
  ) : (
    <p style={styles.noTakers}>No users have taken this quiz yet.</p>
  )}
</div>

      </div>
    </div>
  );
};

// Define custom styles for the component
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f8ff",
    padding: "20px",
  },
  quizCard: {
    backgroundColor: "#007bff",
    borderRadius: "10px",
    color: "white",
    padding: "20px",
    maxWidth: "700px",
    width: "100%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  quizTitle: {
    fontSize: "2.2rem",
    marginBottom: "15px",
    color: "#fffbcc",
    textShadow: "1px 1px 2px #003d80",
  },
  sectionSubtitle: {
    fontSize: "1.5rem",
    color: "#aad4ff",
    marginBottom: "10px",
  },
  infoSection: {
    backgroundColor: "#005bb5",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    color: "#fffbcc",
    textShadow: "1px 1px 2px #003d80",
    borderBottom: "2px solid #aad4ff",
    paddingBottom: "5px",
    marginTop: "20px",
    marginBottom: "10px",
  },
  questionsContainer: {
    marginBottom: "20px",
  },
  questionBlock: {
    backgroundColor: "#005bb5",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "15px",
    color: "#eef",
  },
  questionText: {
    fontSize: "1.2rem",
    marginBottom: "10px",
    color: "#fffbcc",
  },
  optionsList: {
    listStyleType: "none",
    paddingLeft: "0",
  },
  optionItem: {
    backgroundColor: "#003d80",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "8px",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  correctAnswer: {
    backgroundColor: "#28a745",
    color: "white",
    fontWeight: "bold",
  },
  securitySection: {
    backgroundColor: "#005bb5",
    padding: "15px",
    borderRadius: "5px",
    marginTop: "20px",
    color: "#eef",
  },
  securityList: {
    listStyleType: "none",
    paddingLeft: "0",
  },
  tookBySection: {
    backgroundColor: "#005bb5",
    padding: "15px",
    borderRadius: "5px",
    marginTop: "20px",
    color: "#eef",
  },
  tookByUser: {
    backgroundColor: "#003d80",
    padding: "8px",
    borderRadius: "4px",
    marginBottom: "5px",
    color: "white",
  },
  noTakers: {
    fontStyle: "italic",
    color: "#fffbcc",
  },
  loading: {
    fontSize: "1.5rem",
    color: "#007bff",
  },
};

export default ViewTest;
