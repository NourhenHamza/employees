import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Import Redux to check user state
import { useNavigate, useParams } from 'react-router-dom';

const EditEmployer = () => {
  const [employer, setEmployer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuthenticated } = useSelector((state) => state.user); // Get user state from Redux

  // Fetch employer details when component mounts
  useEffect(() => {
    // Redirect non-admins to login or another page
   
    const fetchEmployer = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/user/Employer/${id}`);
        setEmployer(response.data);
      } catch (error) {
        setError('Failed to fetch employer data');
      }
    };

    fetchEmployer();
  }, [id, isAuthenticated, user, navigate]); // Adding dependencies for the effect

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployer({ ...employer, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.put(`http://localhost:4000/api/user/Employer/${id}`, employer);
      setSuccess('Employer updated successfully');
      setTimeout(() => {
        // Redirect to the Employers list page after success
        navigate('/Employers');
      }, 2000); // Navigate after 2 seconds to show the success message
    } catch (error) {
      setError('Error updating employer');
    }
  };

  return (
    <div>
      <h2>Edit Employer</h2>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={employer.name}
          onChange={handleInputChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={employer.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <input
          type="text"
          name="phone"
          value={employer.phone}
          onChange={handleInputChange}
          placeholder="Phone"
        />
        <input
          type="text"
          name="address"
          value={employer.address}
          onChange={handleInputChange}
          placeholder="Address"
        />
        <button type="submit">Update Employer</button>
      </form>
    </div>
  );
};

export default EditEmployer;
