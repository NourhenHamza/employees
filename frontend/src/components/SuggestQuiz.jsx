import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { nanoid } from "nanoid";
import { ToastContainer } from "react-toastify";
import "./CreateTest.css"; // Using your existing CSS file
import { handleError, handleSuccess } from "../utils";
import { Box, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";

const SuggestQuiz = () => {
  const user = useSelector((state) => state.user.user);

  const [ques, setQues] = useState([]);
  const [testName, setTestName] = useState("");
  const [testDuration, setTestDuration] = useState("");
  const [tracker, setTracker] = useState([]);
  const [testID, setTestID] = useState(nanoid(8));
  const [ansKey, setAnsKey] = useState("");
  const [secoption, setSecOption] = useState([false, false, false]);
  const navigate = useNavigate();

  
  const handleAddQuestion = () => {
    setQues([...ques, { quesText: "", options: [] }]);
    setTracker([...tracker, { qText: null, op: [] }]);
    setAnsKey((prev) => (prev += "?"));
  };

  const handleChangeQuestionText = (newText, quesIndex) => {
    const updatedQuestions = [...ques];
    updatedQuestions[quesIndex].quesText = newText;
    setQues(updatedQuestions);
  };

  const handleDeleteQuestion = (quesIndex) => {
    setQues((prevQuestions) => prevQuestions.filter((_, i) => i !== quesIndex));
    setTracker((prevTracker) => prevTracker.filter((_, i) => i !== quesIndex));
    setAnsKey(ansKey.slice(0, quesIndex) + ansKey.slice(quesIndex + 1));
  };

  const handleAddTextOption = (quesIndex) => {
    const updatedQuestions = [...ques];
    updatedQuestions[quesIndex].options.push("");
    setQues(updatedQuestions);

    const updatedTracker = [...tracker];
    updatedTracker[quesIndex].op.push({ img: null, up: false });
    setTracker(updatedTracker);
  };

  const handleTextOption = (e, quesIndex, optionIndex) => {
    const updatedQuestions = [...ques];
    updatedQuestions[quesIndex].options[optionIndex] = e.target.value;
    setQues(updatedQuestions);
  };

  const handleAddImageOption = (quesIndex) => {
    const updatedQuestions = [...ques];
    updatedQuestions[quesIndex].options.push({
      type: "image",
      name: "",
      file: "",
    });
    setQues(updatedQuestions);

    const updatedTracker = [...tracker];
    updatedTracker[quesIndex].op.push({ img: null, up: true });
    setTracker(updatedTracker);
  };

  
  

  const handleChangeOption = (e, quesIndex, optionIndex) => {
    let updatedAnsKey = ansKey.split("");
    updatedAnsKey[quesIndex] = optionIndex + 1;
    setAnsKey(updatedAnsKey.join(""));
  };

  const handleDeleteOption = (quesIndex, optionIndex) => {
    const updatedQuestions = [...ques];
    updatedQuestions[quesIndex].options.splice(optionIndex, 1);
    setQues(updatedQuestions);

    const updatedTracker = [...tracker];
    updatedTracker[quesIndex].op.splice(optionIndex, 1);
    setTracker(updatedTracker);
  };

  const handleSecurityOptions = (index) => {
    setSecOption((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[index] = !newOptions[index];
      return newOptions;
    });
  };

  const handleSuggestTest = (e) => {
    e.preventDefault();

    if (!testName) {
      handleError("Enter Test Name.");
      return;
    }

    if (!testDuration) {
      handleError("Enter Test Duration.");
      return;
    }

    if (ques.length === 0) {
      handleError("Add at least one question to suggest a test.");
      return;
    }

    const data = {
      testID: testID,
      createdBy: user.name,
      testName: testName,
      testDuration: testDuration,
      questions: ques,
      anskey: ansKey,
      tookBy: [],
      security: secoption,
      status: "Requested", // Set status to "Requested" upon suggestion
      createdAt: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),    };
    
    axios
      .post("http://localhost:4000/api/createtest", data)
      .then(() => {
        handleSuccess("Test suggested successfully.");
        navigate("/dashboard");
      })
      .catch((err) => console.error("Error suggesting test:", err));
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
   
      <Typography variant="h4" sx={{ mb: 3 }}>
        Suggest Test </Typography>
  

      <div className="container2">
        <div className="container2item">
          <div className="itemm">
            <p className="itempara1">Enter Test Name</p>
            <input
              className="iteminput1"
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
            />
          </div>

          <div className="itemm">
            <p className="itempara2">
              Enter Test Duration in HH:MM:SS format.
            </p>
            <input
              className="iteminput2"
              type="text"
              value={testDuration}
              onChange={(e) => setTestDuration(e.target.value)}
            />
          </div>

          <div className="itemm">
            <p className="itempara2">Test Code: {testID}</p>
            <button className="gencodebtn" onClick={() => setTestID(nanoid(8))}>
              Generate new code
            </button>
          </div>

          <button className="addquesbtn" onClick={handleAddQuestion}>
            Add New Question
          </button>
        </div>

        <div className="container2item">
          <p>Security Options:</p>
          <label>
            <input
              type="checkbox"
              checked={secoption[0]}
              onChange={() => handleSecurityOptions(0)}
            />
            Camera & Audio Proctoring
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={secoption[1]}
              onChange={() => handleSecurityOptions(1)}
            />
            Enable Full Screen Mode
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={secoption[2]}
              onChange={() => handleSecurityOptions(2)}
            />
            Detect Tab Switch
          </label>
        </div>
      </div>

      <div className="quescontainer">
        {ques.map((question, index) => (
          <div className="quesitem" key={index}>
            <h3>Question {index + 1}</h3>
            <input
              className="questxt"
              type="text"
              value={question.quesText}
              onChange={(e) => handleChangeQuestionText(e.target.value, index)}
              placeholder="Enter Question"
            />
            <button
              className="delquesbtn"
              onClick={() => handleDeleteQuestion(index)}
            >
              Delete Question
            </button>
            <button className="addopbtn" onClick={() => handleAddTextOption(index)}>
              Add Text Option
            </button>
            <button className="addopbtn" onClick={() => handleAddImageOption(index)}>
              Add Image Option
            </button>

            {question.options.map((option, optionIndex) => (
              <div className="option" key={optionIndex}>
                
                  <ul style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      onChange={(e) => handleChangeOption(e, index, optionIndex)}
                      checked={ansKey[index] === String(optionIndex + 1)}
                    />
                    <input
                      className="opinput"
                      type="text"
                      value={option}
                      onChange={(e) => handleTextOption(e, index, optionIndex)}
                      placeholder={`Option ${optionIndex + 1}`}
                    />
                    <button
                      className="delopbtn"
                      onClick={() => handleDeleteOption(index, optionIndex)}
                    >
                      Delete Option
                    </button>
                  </ul>
                
              </div>
            ))}
          </div>
        ))}
      </div>

      <Button variant="contained" color="primary" onClick={handleSuggestTest}>
        Suggest Test
      </Button>


      <ToastContainer />
      </Box>
  );
};

export default SuggestQuiz;
