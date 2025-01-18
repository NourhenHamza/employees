import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [testName, setTestName] = useState("");
  const [testDuration, setTestDuration] = useState("");
  const [questions, setQuestions] = useState([]);
  const [anskey, setAnskey] = useState(""); // Track correct answers
  const [security, setSecurity] = useState([false, false, false]);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/tests/${id}`)
      .then((response) => {
        const data = response.data;
        setQuiz(data);
        setTestName(data.testName);
        setTestDuration(data.testDuration);
        setQuestions(data.questions);
        setSecurity(data.security);
        setAnskey(data.anskey); // Load anskey from server
      })
      .catch((error) => console.error("Error fetching quiz details:", error));
  }, [id]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { quesText: "", options: ["", "", "", ""] },
    ]);
    setAnskey((prev) => prev + "?"); // Add placeholder for correct answer
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].quesText = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);

    if (parseInt(anskey[questionIndex]) === optionIndex + 1) {
      // Reset correct answer if the option deleted was marked as correct
      let updatedAnskey = anskey.split("");
      updatedAnskey[questionIndex] = "?";
      setAnskey(updatedAnskey.join(""));
    }
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    let updatedAnskey = anskey.split("");
    updatedAnskey[questionIndex] = (optionIndex + 1).toString(); // Save as 1-based index
    setAnskey(updatedAnskey.join(""));
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, qIndex) => qIndex !== index));
    setAnskey((prev) => prev.slice(0, index) + prev.slice(index + 1)); // Remove correct answer for this question
  };

  const handleSecurityToggle = (index) => {
    const updatedSecurity = [...security];
    updatedSecurity[index] = !updatedSecurity[index];
    setSecurity(updatedSecurity);
  };

  const handleUpdate = () => {
    const updatedQuiz = {
      ...quiz,
      testName,
      testDuration,
      questions,
      anskey, // Save correct answers in anskey format
      security,
    };

    axios
      .put(`http://localhost:4000/api/tests/${id}`, updatedQuiz)
      .then(() => {
        alert("Quiz updated successfully!");
        navigate("/admin/manage-quizzes");
      })
      .catch((error) => console.error("Error updating quiz:", error));
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h1 style={styles.title}>Edit Quiz</h1>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Test Name</label>
          <input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Duration (HH:MM:SS)</label>
          <input
            type="text"
            value={testDuration}
            onChange={(e) => setTestDuration(e.target.value)}
            style={styles.input}
          />
        </div>

        <h2 style={styles.sectionTitle}>Questions</h2>
        {questions.map((question, qIndex) => (
          <div key={qIndex} style={styles.questionBlock}>
            <input
              type="text"
              value={question.quesText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              style={styles.questionInput}
              placeholder={`Question ${qIndex + 1}`}
            />

            <div style={styles.optionsContainer}>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} style={styles.optionWrapper}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    style={styles.optionInput}
                    placeholder={`Option ${oIndex + 1}`}
                  />
                  <input
                    type="radio"
                    name={`correctAnswer-${qIndex}`}
                    checked={parseInt(anskey[qIndex], 10) === oIndex + 1}
                    onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                    style={styles.radio}
                  />
                  <label style={styles.correctLabel}>Correct</label>
                  <button
                    onClick={() => handleDeleteOption(qIndex, oIndex)}
                    style={styles.deleteOptionButton}
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddOption(qIndex)}
                style={styles.addOptionButton}
              >
                + Add Option
              </button>
            </div>

            <button
              onClick={() => handleDeleteQuestion(qIndex)}
              style={styles.deleteQuestionButton}
            >
              Delete Question
            </button>
          </div>
        ))}

        <button onClick={handleAddQuestion} style={styles.addQuestionButton}>
          Add New Question
        </button>

        <h2 style={styles.sectionTitle}>Security Options</h2>
        <div style={styles.securityContainer}>
          <label style={styles.securityOption}>
            <input
              type="checkbox"
              checked={security[0]}
              onChange={() => handleSecurityToggle(0)}
            />
            Camera & Audio Proctoring
          </label>
          <label style={styles.securityOption}>
            <input
              type="checkbox"
              checked={security[1]}
              onChange={() => handleSecurityToggle(1)}
            />
            Full Screen Mode
          </label>
          <label style={styles.securityOption}>
            <input
              type="checkbox"
              checked={security[2]}
              onChange={() => handleSecurityToggle(2)}
            />
            Tab Switch Detection
          </label>
        </div>

        <button onClick={handleUpdate} style={styles.updateButton}>
          Update Quiz
        </button>
      </div>
    </div>
  );
};


const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f8ff",
    padding: "20px",
  },
  formCard: {
    backgroundColor: "#007bff",
    borderRadius: "10px",
    color: "white",
    padding: "20px",
    maxWidth: "700px",
    width: "100%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  title: {
    fontSize: "2rem",
    color: "#fffbcc",
    marginBottom: "20px",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "1.2rem",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    fontSize: "1rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    color: "#fffbcc",
    marginBottom: "15px",
    borderBottom: "2px solid #aad4ff",
    paddingBottom: "5px",
  },
  questionBlock: {
    backgroundColor: "#005bb5",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "15px",
  },
  questionInput: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    fontSize: "1rem",
  },
  optionsContainer: {
    marginTop: "10px",
  },
  optionWrapper: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  optionInput: {
    flex: "1",
    padding: "10px",
    borderRadius: "5px",
    fontSize: "1rem",
  },
  radio: {
    marginLeft: "10px",
  },
  correctLabel: {
    marginLeft: "5px",
    color: "#fffbcc",
  },
  deleteOptionButton: {
    marginLeft: "10px",
    backgroundColor: "rgb(241, 131, 131)",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "5px",
    cursor: "pointer",
  },
  addOptionButton: {
    marginTop: "10px",
    backgroundColor: "#aad4ff",
    color: "#007bff",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
  },
  deleteQuestionButton: {
    marginTop: "10px",
    backgroundColor: "rgb(241, 131, 131)",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
  },
  addQuestionButton: {
    backgroundColor: "#aad4ff",
    color: "#007bff",
    border: "none",
    borderRadius: "5px",
    padding: "12px 20px",
    fontSize: "1.1rem",
    cursor: "pointer",
    marginTop: "20px",
  },
  securityContainer: {
    marginTop: "20px",
  },
  securityOption: {
    display: "block",
    fontSize: "1.1rem",
    marginBottom: "10px",
  },
  updateButton: {
    marginTop: "20px",
    padding: "12px 20px",
    borderRadius: "5px",
    backgroundColor: "#28a745",
    color: "white",
    fontSize: "1.1rem",
    border: "none",
    cursor: "pointer",
  },
};

export default EditTest;
