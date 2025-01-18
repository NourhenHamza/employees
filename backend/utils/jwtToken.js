export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();
 

  res.status(statusCode).cookie("token", token).json({
    success: true,
    user,
    message,
    token,
  });
};
