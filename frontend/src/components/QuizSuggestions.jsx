import { useEffect, useState } from "react";
import { Card, Button, Typography} from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import "./QuizSuggestions.css";

const { Title, Text } = Typography;

const QuizSuggestions = () => {
  const [tests, setTests] = useState([]); // State for storing test data
  const [loading, setLoading] = useState(false);

  // Fetch tests with status "Requested"
  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:4000/api/v1/suggestions");
        console.log("Fetched Tests:", response.data); // Debug to verify response
        setTests(response.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  // Handle test status update
  const updateTestStatus = async (testID, status) => {
    try {
      await axios.put(`http://localhost:4000/api/v1/suggestions/${testID}`, { status });
      // Remove the test from the list after update
      setTests((prevTests) => prevTests.filter((test) => test.testID !== testID));
    } catch (error) {
      console.error("Error updating test status:", error);
    }
  };

  return (
    <div className="quiz-suggestions-container">
    <Title level={2} className="page-title">Quiz Suggestions</Title>
    {loading ? (
      <Text>Loading...</Text>
    ) : tests.length === 0 ? (
      <Text>No quiz suggestions available.</Text>
    ) : (
      <div className="quiz-card-grid">
        {tests.map((test) => (
          <Card key={test.testID} className="quiz-card">
            <div className="quiz-card-light"></div> {/* Light indicator */}
            <div className="quiz-card-content">
              <Title level={4}>{test.testName}</Title>
              <Text><strong>Duration:</strong>     {test.testDuration}</Text>
              <br></br>
              <Text><strong>Created By:</strong>   {test.createdBy}</Text>
              <br></br>

              <Text>
                <strong>Date:</strong> {new Date(test.createdAt).toLocaleDateString()}
              </Text>
              <br></br>

              <Text><strong>Number Of Questions:</strong> {test.questions.length}</Text>
              <div className="quiz-actions">
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => updateTestStatus(test.testID, "confirmed")}
                >
                  Accept
                </Button>
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => updateTestStatus(test.testID, "rejected")}
                >
                  Decline
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )}
  </div>
);
};

export default QuizSuggestions;
