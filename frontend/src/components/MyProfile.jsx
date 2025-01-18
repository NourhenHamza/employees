 
import { useState } from "react";
import { useSelector } from "react-redux";
import UpdateProfile from "./UpdateProfile";

import { Button } from "@mui/material";

const MyProfile = () => {
  const { user } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit

  const handleEditClick = () => {
    setIsEditing(true); // Show UpdateProfile when Edit is clicked
  };

  if (!user) return null;

  return (
    <div className="account_components" style={styles.container}>
      {!isEditing ? (
        <>
          {/* Edit Button at the Top Right */}
          <Button
            variant="contained"
            color="primary"
            style={styles.editButton}
            onClick={handleEditClick}
          >
            Edit Profile
          </Button>

          <h3 style={styles.header}>My Profile</h3>

          {/* Profile Photo */}
          <div style={styles.profileHeader}>
            <img
              src="/user.png" // Uses the profile image from 'public/user.png'
              alt="User Profile"
              style={styles.profileImage}
            />
          </div>

          {/* Profile Details */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              disabled
              value={user.name}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              disabled
              value={user.email}
              style={styles.input}
            />
          </div>

          {user.role === "Job Seeker" && user.niches && (
  <div style={styles.formGroup}>
    <label style={styles.label}>My Preferred Project Fields</label>
    <div style={styles.niches}>
      <input
        type="text"
        disabled
        value={user.niches.firstNiche || ''}
        style={styles.input}
      />
      <input
        type="text"
        disabled
        value={user.niches.secondNiche || ''}
        style={styles.input}
      />
      <input
        type="text"
        disabled
        value={user.niches.thirdNiche || ''}
        style={styles.input}
      />
    </div>
  </div>
)}


          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="text"
              disabled
              value={user.phone}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Address</label>
            <input
              type="text"
              disabled
              value={user.address}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <input
              type="text"
              disabled
              value={user.role}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Joined On</label>
            <input
              type="text"
              disabled
              value={new Date(user.createdAt).toLocaleDateString()}
              style={styles.input}
            />
          </div>
        </>
      ) : (
        <UpdateProfile /> // Show the UpdateProfile component when editing
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px', // Increased width to make it wider
    margin: '0 auto',
    backgroundColor: '#f4f6f8',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'relative', // For placing the edit button at the top right
  },
  header: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
  },
  profileImage: {
    width: '150px', // Increased size for better visibility
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #ddd',
  },
  editButton: {
    position: 'absolute',
    top: '20px',
    right: '20px', // Positioned in the top-right corner
    height: '43px',
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '5px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: '#f9f9f9',
  },
  niches: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
};

export default MyProfile;
