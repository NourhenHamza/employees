import axios from "axios";
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";
import "./TakeTest.css";

const TakeTest = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [time, setTime] = useState(null);
  const [startTest, setStartTest] = useState(0);
  const [finishTest, setFinishTest] = useState(false);
  const [answers, setAnswers] = useState("");
  const [result, setResult] = useState(0);
  const [resok, setResOk] = useState(false);
  const [permissions, setPermissions] = useState([false, false, false]);
  const [fullscreen, setFullscreen] = useState(false);

  // Initial validation and test setup
  useEffect(() => {
    if (!state || !state.test) {
      console.error("Test data is missing in state.");
      navigate("/error");
    } else {
      const timeParts = state.test.testDuration.split(":");
      const totalTime =
        parseInt(timeParts[0], 10) * 3600 +
        parseInt(timeParts[1], 10) * 60 +
        parseInt(timeParts[2], 10);
      setTime(totalTime * 1000);

      const totalQuestions = state.test.questions.length;
      setAnswers(Array(totalQuestions).fill("?").join("")); // Initialize answer placeholders
    }
  }, [state, navigate]);

  const handleStartTest = () => {
    handleSuccess("Test Started.");
    setTimeout(() => {
      setStartTest(1); // Start test after setup
    }, 500);
  };

  // Setting permissions and initiating media access
  useEffect(() => {
    const initializePermissions = async () => {
      const secop = state?.test?.security || [];
      const newPermissions = [false, false, false];

      if (secop[0]) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          newPermissions[0] = true;
          stream.getTracks().forEach((track) => track.stop());
        } catch (error) {
          console.error("Error accessing media devices:", error);
        }
      }

      if (secop[1]) {
        newPermissions[1] = true;
      }
      if (secop[2]) {
        newPermissions[2] = true;
      }

      setPermissions(newPermissions);
    };

    if (startTest === 0) {
      initializePermissions();
    }
  }, [startTest, state?.test?.security]);

  const handleFullScreenEnable = () => {
    const element = document.getElementById("containerr");
    element.requestFullscreen();
    setFullscreen(true);  // Update fullscreen state to true
  };

  const handleFullScreenDisable = () => {
    document.exitFullscreen();
    setFullscreen(false);  // Update fullscreen state to false
  };

  // Track fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {  // Fullscreen exited
        if (startTest === 1) {
          handleFinishTest();  // End the test when exiting fullscreen
        }
      }
    };

    // Listen for fullscreen change events
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [startTest]);

  // Detect tab switching during the test
  useEffect(() => {
    const handleBlur = () => {
      if (startTest === 1 && permissions[2]) {
        handleError("Tab switching detected! Refrain from it else test will be terminated!");
      }
    };

    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [permissions, startTest]);

  // Countdown timer for the test
  useEffect(() => {
    if (startTest === 1 && time > 0) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1000);
      }, 1000);
      return () => clearInterval(timer);
    } else if (time === 0 && startTest === 1) {
      handleFinishTest();
    }
  }, [startTest, time]);

  const getFormattedTime = (milliseconds) => {
    let total_seconds = parseInt(Math.floor(milliseconds / 1000));
    let total_minutes = parseInt(Math.floor(total_seconds / 60));
    let total_hours = parseInt(Math.floor(total_minutes / 60));

    let seconds = parseInt(total_seconds % 60);
    let minutes = parseInt(total_minutes % 60);
    let hours = parseInt(total_hours % 24);

    return `${hours} : ${minutes} : ${seconds}`;
  };

  const handleOptionChange = (e, quesIndex, optionIndex) => {
    let updatedAnswers = answers.split("");
    updatedAnswers[quesIndex] = e.target.checked ? String.fromCharCode(optionIndex + 1 + 48) : "?";
    setAnswers(updatedAnswers.join(""));
  };

  const handleFinishTest = () => {
    setFinishTest(true);
    setStartTest(2);
    handleSuccess("Test Submitted.");
  };

  // Submit test results after finishing
  useEffect(() => {
    const postSubmit = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/submittest?code=${state.test.testID}`);
        const origanswers = response.data;
        let count = 0;
        for (let i = 0; i < answers.length; i++) {
          if (origanswers[i] === answers[i]) count++;
        }
        setResult(count);
        setResOk(true);
      } catch (error) {
        console.error("Error submitting test:", error);
      }
    };

    if (finishTest && startTest === 2) postSubmit();
  }, [finishTest, startTest, state?.test?.testID, answers]);

  // Send data after receiving results
  useEffect(() => {
    const sendData = async () => {
      const data = {
        testid: state.test.testID,
        val: `${state.userName}/${result}/${answers.length}`,
       
      };

      try {
        await axios.post("http://localhost:4000/submittest", data);
      } catch (error) {
        console.error("Error sending test results:", error);
      }
    };

    if (resok) sendData();
  }, [resok, state?.test?.testID, result, answers.length,state?.userName]);

  return (
    <div className="containerr" id="containerr">
      <div className="opening">
        <h1>Take Test: {state.test.testDuration}</h1>
        <button className="backbtn" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
      </div>

      <div className="intro">
        <div className="intro1">
          <p>Created by: {state.test.createdBy}</p>
          <p>Test Code: {state.test.testID}</p>
          <p>Time Remaining: {getFormattedTime(time)}</p>

          <button className="startbtn" onClick={handleStartTest} disabled={startTest !== 0}>
            Start Test
          </button>

          <button className="finishbtn" onClick={handleFinishTest} disabled={startTest !== 1}>
            Finish Test
          </button>
        </div>

        <div className="intro2">
          {permissions[0] && <p>Camera/audio monitoring enabled.</p>}
          {permissions[1] && (
            <div>
              <p>Full screen mode required.</p>
              <button className="fullscreenbtn" onClick={fullscreen ? handleFullScreenDisable : handleFullScreenEnable}>
                {fullscreen ? "Disable Full Screen" : "Enable Full Screen"}
              </button>
            </div>
          )}
          {permissions[2] && <p>Tab switching disabled during test.</p>}
        </div>
      </div>

      {startTest === 1 && (
        <div className="questions">
          {state.test.questions.map((question, index) => (
            <div key={index}>
              <p>{`Question ${index + 1}: ${question.quesText}`}</p>
              <p>Options:</p>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <label>
                    <input
                      type="checkbox"
                      checked={answers[index] === String.fromCharCode(optionIndex + 1 + 48)}
                      onChange={(e) => handleOptionChange(e, index, optionIndex)}
                    />
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

{finishTest && (
  <div className="testresults">
    <h2>Test Results</h2>
    
    <div className="score">
      {/* Calcul du pourcentage */}
      {Math.round((result / answers.length) * 100)}% {/* Affichage du score en pourcentage */}
    </div>

    
  </div>
)}


      <ToastContainer />
    </div>
  );
};

export default TakeTest;
