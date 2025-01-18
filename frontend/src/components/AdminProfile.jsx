import { useSelector } from "react-redux";

const AdminProfile = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="account_components">
      <h3>Admin Profile</h3>
      <div>
        <label>Full Name</label>
        <input
          type="text"
          disabled
          value={user && user.name}
          onChange={(e) => e.target.value}
        />
      </div>
      <div>
        <label>Email Address</label>
        <input
          type="email"
          disabled
          value={user && user.email}
          onChange={(e) => e.target.value}
        />
      </div>
      <div>
        <label>Phone Number</label>
        <input
          type="number"
          disabled
          value={user && user.phone}
          onChange={(e) => e.target.value}
        />
      </div>
      <div>
        <label>Address</label>
        <input
          type="text"
          disabled
          value={user && user.address}
          onChange={(e) => e.target.value}
        />
      </div>
      <div>
        <label>Role</label>
        <input
          type="text"
          disabled
          value={user && user.role}
          onChange={(e) => e.target.value}
        />
      </div>
      <div>
        <label>Joined On</label>
        <input
          type="text"
          disabled
          value={user && user.createdAt}
          onChange={(e) => e.target.value}
        />
      </div>
      {/* You can add additional fields specific to the admin profile here */}
    </div>
  );
};

export default AdminProfile;
