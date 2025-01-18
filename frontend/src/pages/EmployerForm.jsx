import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EmployerForm = () => {
  const { EmployerId } = useParams();
  const navigate = useNavigate();
  const [EmployerData, setEmployerData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/user/provisional-Employer/${EmployerId}`);
        setEmployerData(response.data);
        setFormData({
          name: response.data.name || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          password: '', // The password is empty so the employer can define it
        });
      } catch (error) {
        setError('Error loading Employer data. Please try again later.');
        console.error('Error fetching Employer data:', error);
      }
    };
    fetchEmployerData();
  }, [EmployerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.phone || !formData.address || !formData.password) {
      setError('All fields are required!');
      return;
    }

    const dataToSend = {
      id: EmployerId,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      password: formData.password,
    };

    try {
      await axios.post(
        `http://localhost:4000/api/user/complete-profile-Employer`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccess('Profile completed successfully!');
      navigate('/'); // Navigate to the login page
    } catch (error) {
      if (error.response) {
          // Capture server error response
          setError(error.response.data.message || 'Error submitting the form. Please try again.');
      } else {
          setError('An unknown error occurred.');
      }
      console.error('Error submitting form:', error);
  }
  
  };

  if (!EmployerData) return <p>Loading...</p>;

  return (
    <div className="Employer-form-container">
      <h2>Complete Your Profile</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <label>Email:</label>
          <input type="text" value={EmployerData.email} readOnly />
        </div>

        <button type="submit" className="btn">Submit</button>
      </form>
    </div>
  );
};

export default EmployerForm;
