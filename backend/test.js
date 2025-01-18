import bcrypt from 'bcrypt';

const inputPassword = "123456789";
const storedHash = "$2b$10$aoybUGOe50OYcvLIPCXiwui3yQJ0nup5QS6ysDJYO0IRBaf0Ze6F2";

(async () => {
  const rehashed = await bcrypt.hash(inputPassword, 10);
  console.log("Newly hashed password:", rehashed);

  const isMatch = await bcrypt.compare(inputPassword, storedHash);
  console.log("Does the input password match the stored hash?", isMatch);
})();
