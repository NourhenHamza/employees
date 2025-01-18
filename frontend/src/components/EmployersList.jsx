import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Import Redux to check user state
import { useNavigate } from 'react-router-dom';

const EmployerList = () => {
  const [confirmedEmployers, setConfirmedEmployers] = useState([]);
  const [provisionalEmployers, setProvisionalEmployers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEmployer, setNewEmployer] = useState({ email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user); // Get user state from Redux

  useEffect(() => {
    // Redirect non-admins to login or another page
    if (!isAuthenticated || user.role !== 'admin') {
      navigate('/login'); // Redirect to login page if not admin
      return;
    }

    const fetchEmployers = async () => {
      try {
        const [confirmedRes, provisionalRes] = await Promise.all([
          axios.get('http://localhost:4000/api/user/Employer'),
          axios.get('http://localhost:4000/api/user/provisional-Employer'),
        ]);
        setConfirmedEmployers(Array.isArray(confirmedRes.data) ? confirmedRes.data : []);
        setProvisionalEmployers(Array.isArray(provisionalRes.data) ? provisionalRes.data : []);
      } catch (error) {
        console.error('Error fetching employers:', error);
        setConfirmedEmployers([]);
        setProvisionalEmployers([]);
      }
    };

    fetchEmployers();
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployer({ ...newEmployer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:4000/api/user/provisional-Employer', newEmployer);
      console.log('Provisional employer created:', response.data);

      setSuccess('Employer created successfully!');
      setTimeout(() => {
        setShowForm(false);
        window.location.reload();
      }, 2000);

      setNewEmployer({ email: '' });
    } catch (error) {
      console.error('Error creating provisional employer:', error);
      setError(error.response?.data?.message || 'An unknown error occurred. Please try again.');
    }
  };

  const handleView = (id, isProvisional) => {
    if (isProvisional) {
      navigate(`/provisional-employer/${id}`); // Route for provisional employer
    } else {
      navigate(`/confirmed-employer/${id}`); // Route for confirmed employer
    }
  };

  const handleEdit = (id) => {
    console.log('Editing employer with ID:', id);
    navigate(`/edit-employer/${id}`); // Navigate to the edit page for confirmed employers
  };

  const handleDelete = async (id, isProvisional) => {
    try {
      const url = isProvisional
        ? `http://localhost:4000/api/user/provisional-Employer/${id}`
        : `http://localhost:4000/api/user/Employer/${id}`;

      await axios.delete(url);

      if (isProvisional) {
        setProvisionalEmployers(provisionalEmployers.filter((user) => user._id !== id));
      } else {
        setConfirmedEmployers(confirmedEmployers.filter((user) => user._id !== id));
      }
    } catch (error) {
      console.error('Error deleting employer:', error);
    }
  };

  return (
    <div className="employer-container">
      <h2>Employers</h2>
      <button className="btn create-employer-btn" onClick={() => setShowForm(true)}>
        Create Employer
      </button>

      {showForm && (
        <div className="employer-form">
          <h3>Create a New Employer</h3>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newEmployer.email}
              onChange={handleInputChange}
              required
            />
            <button type="submit" className="btn">Create</button>
            <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}

      <div className="employer-section confirmed-employers">
        <h3>Confirmed Employers</h3>
        <ul className="employer-list">
          {confirmedEmployers.map((user) => (
            <li key={user._id}>
              {user.name} - {user.email}
              <div className="employer-actions">
                <button 
                  className="view-btn confirmed-view-btn" 
                  onClick={() => handleView(user._id, false)}
                >
                  View Work
                </button>
                <button className="edit-btn" onClick={() => handleEdit(user._id)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(user._id, false)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="employer-section provisional-employers">
        <h3>Pending Employers</h3>
        <ul className="employer-list">
          {provisionalEmployers.map((user) => (
            <li key={user._id}>
              {user.email}
              <div className="employer-actions">
                <button className="edit-btn" onClick={() => handleEdit(user._id)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(user._id, true)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmployerList;
