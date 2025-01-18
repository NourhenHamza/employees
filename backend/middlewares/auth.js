import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  console.log('Checking authentication...');

  // Essayez d'abord de récupérer le token depuis les cookies
  let token = req.cookies.token;

  // Si le token n'est pas trouvé dans les cookies, essayez dans les paramètres de l'URL
  if (!token) {
    token = req.query.token;  // Récupération du token depuis l'URL
  }

  if (!token) {
    console.log('No token found.');
    return next(new ErrorHandler("User is not authenticated.", 400));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Token verified, decoded ID:', decoded.id);
    
    // Récupération de l'utilisateur à partir du token décodé
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      console.log('User not found in database.');
      return next(new ErrorHandler("User not found.", 404));
    }

    console.log('User authenticated:', req.user);
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return next(new ErrorHandler("Invalid token.", 401));
  }
});



export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resource.`
        )
      );
    }
    next();
  };
};

