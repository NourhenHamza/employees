import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ManageQuizzes = () => {
  
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [filters, setFilters] = useState({
    testID: "",
    testName: "",
    createdBy: "",
    testDuration: "",
    createdAt: "",
    status: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch quizzes from backend
    axios
      .get("http://localhost:4000/api/tests")
      .then((response) => {
        setQuizzes(response.data);
        setFilteredQuizzes(response.data);
      })
      .catch((error) => console.error("Error fetching quizzes:", error));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:4000/api/tests/${id}`)
      .then(() => {
        const updatedQuizzes = quizzes.filter((quiz) => quiz._id !== id);
        setQuizzes(updatedQuizzes);
        setFilteredQuizzes(updatedQuizzes);
      })
      .catch((error) => console.error("Error deleting quiz:", error));
  };

  const handleView = (id) => {
    navigate(`/admin/view-test/${id}`);
  };

  const handleUpdate = (id) => {
    navigate(`/admin/edit-test/${id}`);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    const filtered = quizzes.filter((quiz) =>
      Object.keys(filters).every((filterKey) => {
        if (filterKey === key) {
          if (filterKey === "status" && value === "*") return true; // Reset filter for 'All'
          return value ? quiz[filterKey]?.toString().toLowerCase().includes(value.toLowerCase()) : true;
        }
        if (filters[filterKey]) {
          return quiz[filterKey]?.toString().toLowerCase().includes(filters[filterKey].toLowerCase());
        }
        return true;
      })
    );
    setFilteredQuizzes(filtered);
  };

  const handleStatusChange = (id, newStatus) => {
    axios
      .put(`http://localhost:4000/api/tests/${id}/status`, { status: newStatus }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        // Update the quizzes state locally
        const updatedQuizzes = quizzes.map((quiz) =>
          quiz._id === id ? { ...quiz, status: newStatus } : quiz
        );
        setQuizzes(updatedQuizzes);
        setFilteredQuizzes(updatedQuizzes);
      })
      .catch((error) => console.error("Error updating quiz status:", error));
  };
  
  
  
  

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Quizzes</h1>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
            {["Test ID", "Name", "Created By", "Duration", "Date", "Status"].map((header) => (
              <th key={header} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                {header}
              </th>
            ))}
            <th style={{ padding: "24px", borderBottom: "1px solid #ddd" }}>Actions</th>
          </tr>
          <tr>
            <th>
              <input
                type="text"
                placeholder="Search Test ID"
                value={filters.testID}
                onChange={(e) => handleFilterChange("testID", e.target.value)}
                style={{ width: "100%", padding: "5px" }}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Search Name"
                value={filters.testName}
                onChange={(e) => handleFilterChange("testName", e.target.value)}
                style={{ width: "100%", padding: "5px" }}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Search Created By"
                value={filters.createdBy}
                onChange={(e) => handleFilterChange("createdBy", e.target.value)}
                style={{ width: "100%", padding: "5px" }}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Search Duration"
                value={filters.testDuration}
                onChange={(e) => handleFilterChange("testDuration", e.target.value)}
                style={{ width: "100%", padding: "5px" }}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Search Date"
                value={filters.createdAt}
                onChange={(e) => handleFilterChange("createdAt", e.target.value)}
                style={{ width: "100%", padding: "5px" }}
              />
            </th>
            <th>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                style={{ width: "100%", padding: "5px" }}
              >
                <option value="*">All</option>
                <option value="requested">Requested</option>
                <option value="rejected">Declined</option>
                <option value="confirmed">Confirmed</option>
              </select>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredQuizzes.map((quiz) => (
            <tr key={quiz._id}>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{quiz.testID}</td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{quiz.testName}</td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{quiz.createdBy}</td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{quiz.testDuration}</td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{quiz.createdAt}</td>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{quiz.status}</td>
              <td style={{ padding: "24px", borderBottom: "1px solid #ddd", display: "flex", gap: "10px" }}>
                <button onClick={() => handleView(quiz._id)}>View</button>
                <button onClick={() => handleUpdate(quiz._id)} style={{ color: "blue" }}>
                  Update
                </button>
                <button onClick={() => handleDelete(quiz._id)} style={{ color: "red" }}>
                  Delete
                </button>
                {/* Show Accept and Refuse only if the quiz status is "requested" */}
                {quiz.status === "requested" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(quiz._id, "confirmed")}
                      style={{ color: "green" }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(quiz._id, "rejected")}
                      style={{ color: "orange" }}
                    >
                      Refuse
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageQuizzes;
