import bcrypt from 'bcrypt';
import { v2 as cloudinary } from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { ProvisionalEmployer } from "../models/provisionalEmployer.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const completeEmployerProfile = async (req, res) => {
  const { id, name, phone, address, password } = req.body;

  try {
    // Step 1: Validate the required fields are present
    if (!id || !password || !name || !phone || !address) {
      return res.status(400).json({ message: 'ID, name, phone, address, and password are required' });
    }

    // Step 2: Retrieve the existing provisional employer data
    const provisionalEmployer = await ProvisionalEmployer.findById(id);
    if (!provisionalEmployer) {
      return res.status(404).json({ message: 'Employer not found in provisional collection' });
    }
    console.log("Stored pass during registration:", password);

// Step 3: Hash the password using bcrypt
/*const hashedPassword = await bcrypt.hash(password, 10); // Await the promise
console.log("Stored hash during registration:", hashedPassword);*/

// Step 4: Prepare the data for the new employer in the 'User' collection
const newEmployerData = new User({
  name,                         // Name from the request
  phone,                        // Phone from the request
  address,                      // Address from the request
  email: provisionalEmployer.email, // Email from the provisional employer
  password/*: hashedPassword*/,     // Use the full hashed password
  role: 'Employer',             // Role set as 'Employer'
});
console.log("Stored hash data:", newEmployerData.password);

// Step 5: Create the new employer in the 'User' collection
await newEmployerData.save();
    res.status(201).json(newEmployerData);
  

    // Step 6: Delete the provisional employer data after successful creation
    await ProvisionalEmployer.findByIdAndDelete(id);

    
  } catch (error) {
    console.error('Error completing Employer profile:', error);

    // Ensure the error response is sent only once
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Error completing Employer profile', error: error.message });
    }
  }
};

// Fonction pour récupérer un Employer provisoire
export const getProvisionalEmployer = async (req, res) => {
  const { id } = req.params; // id passed in the URL
  try {
    const Employer = await ProvisionalEmployer.findById(id); // Search for the Employer by ID
    if (!Employer) {
      return res.status(404).json({ message: "Employer not found" });
    }
    res.json(Employer);
  } catch (error) {
    console.error('Error fetching Employer:', error); // Log the error to the console
    res.status(500).json({ message: "Server error", error: error.message }); // Return error message in response
  }
};
// Fonction pour envoyer l'email d'invitation
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Register a new user
export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      password,
      role,
   
      coverLetter,
    } = req.body;

    if (!name || !email || !phone || !address || !password || !role) {
      return next(new ErrorHandler("All fields are required.", 400));
    }
    

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email is already registered.", 400));
    }

    const userData = {
      name,
      email,
      phone,
      address,
      password,
      role,
     
      coverLetter,
    };

    // Handle resume upload if provided
    if (req.files && req.files.resume) {
      const { resume } = req.files;
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          resume.tempFilePath,
          { folder: "Job_Seekers_Resume" }
        );
        userData.resume = {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        };
      } catch (error) {
        return next(new ErrorHandler("Failed to upload resume", 500));
      }
    }

    const user = await User.create(userData);
    sendToken(user, 201, res, "User registered successfully.");
  } catch (error) {
    next(error);
  }
});

// Login a user
export const login = catchAsyncErrors(async (req, res, next) => {
  const { role, email, password } = req.body;
  if (!role || !email || !password) {
    return next(new ErrorHandler("Email, password, and role are required.", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email  ", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid  password.", 400));
  }

  if (user.role !== role) {
    return next(new ErrorHandler("Invalid user role.", 400));
  }

  sendToken(user, 200, res, "User logged in successfully.");
});




 
// Admin login
export const adminLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required.", 400));
  }

  const adminUser = await User.findOne({ email, role: "admin" }).select("+password");
  if (!adminUser) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  const isPasswordMatched = await adminUser.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  sendToken(adminUser, 200, res, "Admin logged in successfully.");
});

// Logout user
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.status(200)
    .cookie("token", "", { expires: new Date(Date.now()), httpOnly: true })
    .json({ success: true, message: "Logged out successfully." });
});

// Get the logged-in user’s profile
export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});







export const updateUserProfile = async (req, res) => {
    try {
      const { name, email, phone, address, coverLetter, firstNiche, secondNiche, thirdNiche } = req.body;
  
      const user = await User.findById(req.user._id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Update the fields
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.address = address || user.address;
      user.coverLetter = coverLetter || user.coverLetter;
      user.niches = { firstNiche, secondNiche, thirdNiche };
  
      if (req.files && req.files.resume) {
        user.resume = req.files.resume[0].path; // Assuming file is uploaded
      }
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
  
  
// userController.js
export const getUserProfile = (req, res) => {
    try {
      // Assuming `req.user` contains the user data (e.g., set by authentication middleware)
      res.status(200).json({
        success: true,
        user: req.user, // You can return the user data here
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
  


  export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
  
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect.", 400));
    }
  
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("New password and confirm password do not match.", 400));
    }
  
    // Update the password
    user.password = req.body.newPassword;
    await user.save();
  
    // Send a success response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully.", // Success message
    });
  });
  
  

export const createUser = async (req, res) => {
  try {
    const { name, email, phone, address, firstNiche, secondNiche, thirdNiche, password, coverLetter, role } = req.body;
    
    let resume = {};
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      resume = { public_id: result.public_id, url: result.secure_url };
    }

    const newUser = new User({
      name,
      email,
      phone,
      address,
      niches: { firstNiche, secondNiche, thirdNiche },
      password,
      resume,
      coverLetter,
      role,
      createdAt: new Date()
    });

    await newUser.save();
    res.status(201).json({ message: "Employer profile created successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error creating profile" });
  }
};
// Créer un nouvel utilisateur dans la collection 'users'
export const createUserEmployer = async (req, res) => {
  const { firstNiche, secondNiche, thirdNiche, resume, coverLetter, password } = req.body;

  try {
    // Créer un nouvel utilisateur à partir des données envoyées
    const newUser = new User({
      firstNiche,
      secondNiche,
      thirdNiche,
      resume,
      coverLetter,
      password,
      role: 'Employer',
      createdAt: new Date(),
    });

    // Enregistrer l'utilisateur dans la base de données
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).send('Error creating user');
  }
};

 

// Delete a confirmed employer
export const deleteConfirmedEmployer = async (req, res) => {
  try {
    const { id } = req.params;
    const confirmedEmployer = await User.findByIdAndDelete(id);

    if (!confirmedEmployer) {
      return res.status(404).json({ message: 'Confirmed employer not found' });
    }

    res.status(200).json({ message: 'Confirmed employer deleted successfully' });
  } catch (error) {
    console.error('Error deleting confirmed employer:', error);
    res.status(500).json({ message: 'Error deleting confirmed employer' });
  }
};

export const deleteProvisionalEmployer = async (req, res) => {
  const { id } = req.params;
  try {
    const employer = await ProvisionalEmployer.findByIdAndDelete(id);
    if (!employer) return res.status(404).json({ message: 'Employer not found' });
    res.status(200).json({ message: 'Employer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get confirmed employer details
// Get employer details
export const getEmployerDetails = async (req, res) => {
  try {
    const employer = await User.findOne({ _id: req.params.id, role: 'Employer' }).select('-password'); // Find user by ID and filter for role "Employer"

    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    res.status(200).json(employer);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateEmployer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    // Find the employer by ID
    const employer = await User.findById(id);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    // Update only the specified fields
    employer.name = name || employer.name;
    employer.email = email || employer.email;
    employer.phone = phone || employer.phone;
    employer.address = address || employer.address;

    // Save updated employer
    const updatedEmployer = await employer.save();

    res.status(200).json(updatedEmployer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};