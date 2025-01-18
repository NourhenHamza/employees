
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const {  user } = useSelector(
    (state) => state.user
  );
  useEffect(() => {
    // Fetch only quizzes created by employers
    axios
      .get("http://localhost:4000/api/tests")
      .then((response) => {
        
        // Filter quizzes created by employers only
        const employerQuizzes = response.data.filter(
          (quiz) => quiz.createdBy == user.name
        );
        setQuizzes(employerQuizzes);
      })
      .catch((error) => console.error("Error fetching quizzes:", error));
  }, []);

  const handleView = (id) => {
    navigate(`/admin/view-test/${id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      
     

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              Test ID
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              Name
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              Created By
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              Duration
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              Date
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              Status
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <tr key={quiz._id}>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {quiz.testID}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {quiz.testName}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {quiz.createdBy}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {quiz.testDuration}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {quiz.createdAt}
                </td>
               <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {quiz.status}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <button
                    onClick={() => handleView(quiz._id,"Quizzes")}
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    ViewWW
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#777",
                }}
              >
                No quizzes created by you yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};








export default Quizzes;



 
