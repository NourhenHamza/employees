// src/components/AdminDashboard.js


const AdminDashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        
        {/* User Management Section */}
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "5px", width: "30%" }}>
          <h2>User Management</h2>
          <p>Manage registered users, view profiles, and assign roles.</p>
          <button>View Users</button>
        </div>

        {/* Job Postings Section */}
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "5px", width: "30%" }}>
          <h2>Job Postings</h2>
          <p>Create, edit, or delete job listings.</p>
          <button>Manage Jobs</button>
        </div>

        {/* Analytics Section */}
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "5px", width: "30%" }}>
          <h2>Analytics</h2>
          <p>View site usage statistics and reports.</p>
          <button>View Analytics</button>
        </div>
      </div>

      {/* Add additional sections as needed */}
      <div style={{ marginTop: "20px" }}>
        <h3>Notifications</h3>
        <p>No new notifications.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;