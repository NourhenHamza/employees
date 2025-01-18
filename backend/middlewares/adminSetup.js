import bcrypt from "bcrypt";
import mongoose from "mongoose";
import app from "./app.js";
import { User } from "./models/userSchema.js";

const PORT = process.env.PORT || 4000;

const createAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      if (hashedPassword.length > 32) {
        throw new Error("Admin password cannot exceed 32 characters.");
      }

      const adminData = {
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
        phone: "1234567890",
        address: "Admin Address",
      };

      await User.create(adminData);
      console.log("Admin created successfully.");
    } else {
      console.log("Admin already exists.");
    }
  } catch (error) {
    console.error("Failed to create admin:", error);
  }
};

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await createAdmin();
    app.listen(PORT, () => {
      console.log(`Server is running on Port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
