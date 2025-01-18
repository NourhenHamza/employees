// UserInfo.js
import { useSelector } from "react-redux";

const UserInfo = () => {
  const user = useSelector((state) => state.user.user);

  return (
    <div>
      <h2>Logged-in User Information</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default UserInfo;
