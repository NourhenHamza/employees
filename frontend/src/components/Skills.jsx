import { Box, Button, Card, CardContent, Chip, Divider, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Skills = () => {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [takenTests, setTakenTests] = useState([]);
  const [foundTakenTests, setFoundTakenTests] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();
   
  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setLoggedInUser(parsedUser);
      } catch (error) {
        console.error("Error parsing loggedInUser:", error);
      }
    } else {
      console.error("No loggedInUser found in localStorage");
    }

    const fetchTests = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/tests");
        setAvailableSkills(response.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, []);

  useEffect(() => {
    const fetchTakenTests = async () => {
      if (loggedInUser) {
        try {
          const response = await axios.get(`http://localhost:4000/findtakentests?user=${loggedInUser.name}`);
          
          if (response.data.message) {
            setTakenTests([]); // No tests taken
          } else {
            setTakenTests(response.data); // Tests found
          }
          setFoundTakenTests(true);
        } catch (error) {
          console.error("Error fetching taken tests:", error);
        }
      }
    };

    fetchTakenTests();
  }, [loggedInUser]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setShowSuggestions(e.target.value.trim().length > 0); // Only show suggestions when there's input
  };

  const handleVerifyTest = (test) => {
    if (loggedInUser) {
      navigate(`/taketest/${test.testID}`, {
        state: {
          test: test,
          userName: loggedInUser.name
        }
      });
    } else {
      console.error("User not logged in");
    }
  };

  const filteredSkills = availableSkills.filter(skill =>
    skill.testName.toLowerCase().includes(search.toLowerCase())
  );

  const hasTakenTest = (testID) => {
    return takenTests.some((test) => test.testID === testID);
  };

  const getScore = (testID) => {
    const test = takenTests.find((t) => t.testID === testID);
    if (test) {
      const userEntry = test.tookBy.find(entry => entry.startsWith(loggedInUser.name));
      if (userEntry) {
        const [, correctAnswers, totalQuestions] = userEntry.split("/");
        const scorePercentage = ((parseInt(correctAnswers) / parseInt(totalQuestions)) * 100).toFixed(2);
        return `${scorePercentage}%`;
      }
    }
    return "N/A"; // Default if no score is found
  };

  return (
    <Box sx={{ maxWidth: 900, margin: "auto", textAlign: "center", padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2C3E50' }}>Manage Your Skills</Typography>

      <TextField
        label="Search for Test"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        onFocus={() => setShowSuggestions(true)}
        fullWidth
        margin="normal"
        sx={{
          marginBottom: 3,
          borderRadius: 3,
          '& .MuiInputBase-root': {
            backgroundColor: '#ECF0F1',
          }
        }}
      />

      {showSuggestions && filteredSkills.length > 0 && (
        <List sx={{ marginBottom: 4 }}>
          {filteredSkills.map((skill, index) => (
            <ListItem 
              button
              key={index}
              sx={{
                padding: 1.5,
                backgroundColor: '#F4F6F8',
                borderRadius: '8px',
                marginBottom: 2,
                '&:hover': {
                  backgroundColor: '#E1E8ED',
                }
              }}
            >
              <ListItemText primary={skill.testName} sx={{ flexGrow: 1 }} />
              {!hasTakenTest(skill.testID) ? (
             <Button
             variant="contained"
             color="primary"
             onClick={() => handleVerifyTest(skill)}
             sx={{
               backgroundColor: '#3498DB',
               '&:hover': { backgroundColor: '#2980B9' },
               fontWeight: 'bold',
               textTransform: 'none',
               paddingX: 2, // Reduced horizontal padding
               paddingY: 0.75, // Reduced vertical padding
               borderRadius: 2,
               fontSize: '0.9rem', // Adjusted font size
               minWidth: 'fit-content', // Ensures the button wraps around its content
             }}
           >
             Verify Test
           </Button>
           
              ) : (
                <Chip
                  label={`Verified - Score: ${getScore(skill.testID)}`}
                  color="success"
                  variant="filled"
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: '#2ecc71',
                    color: 'white',
                    paddingX: 3,
                    paddingY: 1.5,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#34495E' }}>Tests You Have Taken</Typography>
        <br />
        {foundTakenTests ? (
          takenTests.length === 0 ? (
            <Typography>No tests taken yet.</Typography>
          ) : (
            takenTests.map((test, testIndex) => {
              const score = getScore(test.testID);

              return (
                <Card sx={{ mb: 2, p: 2, boxShadow: 3, backgroundColor: '#F9F9F9' }} key={testIndex}>
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {testIndex + 1}: {test.testName}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      Duration: {test.testDuration} minutes
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Test ID: {test.testID}
                    </Typography>
                    {score !== "N/A" && (
                      <Typography variant="body2" color="primary" sx={{ marginTop: 2, fontWeight: 'bold' }}>
                        Verified: Score {score}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )
        ) : (
          <Typography>Loading....</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Skills;
