import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose"; // Add this line
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, "Name must contain at least 3 characters."],
    maxlength: [30, "Name cannot exceed 30 characters."],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email."],
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  niches: {
    firstNiche: String,
    secondNiche: String,
    thirdNiche: String,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must contain at least 8 characters."],
    maxlength: [100, "Password cannot exceed 100 characters."], // Increased maxlength
    select: false,
  },
  profilePhoto: {
    public_id: { type: String }, // Optional ID for external storage
    url: { type: String }, // Optional URL of the photo
  },
  resume: {
    public_id: String,
    url: String,
  },
  coverLetter: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["Job Seeker", "Employer", "admin"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // New skills field
  skills: [
    {
      name: { type: String, required: true },
      score: { type: Number, required: true, min: 0, max: 100 },
    },
  ],
});

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token for authentication
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
export default User;
