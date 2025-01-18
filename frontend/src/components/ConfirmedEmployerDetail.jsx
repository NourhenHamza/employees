import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Import Redux to check user state
import { useNavigate, useParams } from 'react-router-dom';

const ConfirmedEmployerDetail = () => {
  const { id } = useParams(); // Get the employer ID from the URL
  const [employer, setEmployer] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user); // Get user state from Redux

  useEffect(() => {
    // Redirect non-admins to login or another page
    if (!isAuthenticated || user.role !== 'admin') {
      navigate('/login'); // Redirect to login page if not admin
      return;
    }

    const fetchEmployer = async () => {
      try {
        // Ensure the URL matches the backend API route
        const response = await axios.get(`http://localhost:4000/api/user/Employer/${id}`);
        setEmployer(response.data); // Set the employer data
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch employer details');
        setLoading(false);
      }
    };

    fetchEmployer();
  }, [id, isAuthenticated, user, navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="confirmed-employer-detail">
      {employer ? (
        <div>
          <h2>Employer Details</h2>
          <p><strong>Name:</strong> {employer.name}</p>
          <p><strong>Email:</strong> {employer.email}</p>
          <p><strong>Phone:</strong> {employer.phone}</p>
          <p><strong>Address:</strong> {employer.address}</p>
        </div>
      ) : (
        <p>No employer data found</p>
      )}
    </div>
  );
};

export default ConfirmedEmployerDetail;
