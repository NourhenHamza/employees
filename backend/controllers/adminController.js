import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";


 
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id); // Récupère l'administrateur par son ID
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin); // Renvoie les données de l'administrateur
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updateAdminProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, phone, address } = req.body; // Ensure these fields are included in your request

  const adminId = req.user.id; // Get the admin ID from the authenticated request

  // Update admin information in the database
  const updatedAdmin = await User.findByIdAndUpdate(
    adminId,
    { name, phone, address }, // Only update these fields, do not update email or password
    { new: true, runValidators: true } // Return the updated document and validate
  );

  if (!updatedAdmin) {
    return next(new ErrorHandler("Admin not found.", 404));
  }

  res.status(200).json({
    message: "Profile updated successfully",
    admin: updatedAdmin // Send back the updated admin data
  });
});
