import { useState } from 'react';

const AddQuizz = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizSynopsis, setQuizSynopsis] = useState('');
  const [questions, setQuestions] = useState([{ question: '', answers: ['', '', '', ''], correctAnswer: '' }]);

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answers: ['', '', '', ''], correctAnswer: '' }]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle quiz submission here
    console.log({ quizTitle, quizSynopsis, questions });
  };

  return (
    <div className="add-quizz-container">
      <h1 className="title">📝 Create a New Quiz</h1>
      <form onSubmit={handleSubmit} className="quiz-form">
        <div className="input-group">
          <label>Quiz Title:</label>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Synopsis:</label>
          <textarea
            value={quizSynopsis}
            onChange={(e) => setQuizSynopsis(e.target.value)}
            required
          />
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-container">
            <h3 className="question-title">Question {qIndex + 1} 🤔</h3>
            <input
              type="text"
              name="question"
              placeholder="Enter your question"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              required
              className="question-input"
            />
            <div className="answers-container">
              {q.answers.map((answer, aIndex) => (
                <input
                  key={aIndex}
                  type="text"
                  placeholder={`Answer ${aIndex + 1}`}
                  value={answer}
                  onChange={(e) => handleAnswerChange(qIndex, aIndex, e)}
                  required
                  className="answer-input"
                />
              ))}
            </div>
            <div className="input-group">
              <label>Correct Answer Index (0-3):</label>
              <input
                type="number"
                name="correctAnswer"
                min="0"
                max="3"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                required
                className="correct-answer-input"
              />
            </div>
            <hr className="question-separator" />
          </div>
        ))}

        <button type="button" className="add-question-btn" onClick={addQuestion}>
          ➕ Add Another Question
        </button>
        <button type="submit" className="submit-btn">Submit Quiz</button>
      </form>
    </div>
  );
};

 
 

export default AddQuizz;
