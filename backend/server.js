import { config } from "dotenv";
import mongoose from "mongoose";
import app from "./app.js"; // Import the main Express app
import { mongoURI } from "./config/keys.js"; // MongoDB connection URI
import TestModel from "./models/TestModel.js";
import { User } from "./models/userSchema.js";
import { Application } from "./models/applicationSchema.js";
import adminRoutes from "./routes/adminRoutes.js";
import ProjectRouter from "./routes/ProjectRouter.js";
import projectRoutes from './routes/projectRoutes.js';
import userRoutes from "./routes/userRouter.js";
import { isAuthenticated } from './middlewares/auth.js';






// Load environment variables
config({ path: ".env" });

// Mount admin and user routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/Project", ProjectRouter);

 
// Mount project routes
app.use("/api/v1/projects", projectRoutes);

// Function to create an admin if one doesn't exist
const createAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (!existingAdmin) {
      await User.create({
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
        phone: "1234567890",
        address: "Admin Address",
      });
          sendToken(user, 201, res, "Admin created successfully.");
      
    } else {
      console.log("Admin already exists.");
    }
  } catch (error) {
    console.error("Failed to create admin:", error);
  }
};

// MongoDB Connection
mongoose
  .connect(mongoURI || process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await createAdmin();
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running on Port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

  app.put("/api/tests/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    // Valider le statut (doit être soit "confirmed" ou "declined")
    if (!status || !["confirmed", "declined"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide fourni" });
    }
  
    try {
      // Trouver le test par son ID et mettre à jour son statut
      const quiz = await TestModel.findByIdAndUpdate(
        id,
        { status }, // Mise à jour du statut
        { new: true } // Retourner le test mis à jour
      );
  
      // Si le quiz n'est pas trouvé
      if (!quiz) {
        return res.status(404).json({ message: "Test non trouvé" });
      }
  
      // Retourner le test mis à jour
      res.status(200).json(quiz);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut du test :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
  

// Define routes for TestModel CRUD operations

// POST route to create a new test
app.post("/createtest", async (req, res) => {
  try {
    const newTest = await TestModel.create(req.body);
    res.status(201).json(newTest);
  } catch (error) {
    console.error("Error creating test:", error);
    res.status(500).json({ message: "Failed to create test", error: error.message });
  }
});

// PUT route to update a test by ID
app.put("/api/tests/:id", async (req, res) => {
  try {
    const updatedQuiz = await TestModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedQuiz) return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json(updatedQuiz);
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Failed to update quiz", error: error.message });
  }
});

// DELETE route to delete a test by ID
app.delete("/api/tests/:id", async (req, res) => {
  try {
    const deletedTest = await TestModel.findByIdAndDelete(req.params.id);
    if (!deletedTest) return res.status(404).json({ message: "Test not found" });
    res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    console.error("Error deleting test:", error);
    res.status(500).json({ message: "Failed to delete test", error: error.message });
  }
});

// GET route to fetch a specific test by ID
app.get("/api/tests/:id", async (req, res) => {
  try {
    const test = await TestModel.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.status(200).json(test);
  } catch (error) {
    console.error("Error fetching test:", error);
    res.status(500).json({ message: "Failed to fetch test", error: error.message });
  }
});

// GET route to fetch all tests
app.get("/api/v1/tests", async (req, res) => {
  try {
    const tests = await TestModel.find();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tests" });
  }
});

// GET route to fetch a test by testID
app.get("/api/tests/:testID", async (req, res) => {
  try {
    const test = await TestModel.findOne({ testID: req.params.testID });
    if (!test) return res.status(404).json({ error: "Test not found" });
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch test" });
  }
});

// GET route to fetch the answer key by test code
app.get("/submittest", async (req, res) => {
  try {
    const test = await TestModel.findOne({ testID: req.query.code });
    res.json(test ? test.anskey : null);
  } catch (error) {
    console.error("Error fetching test:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST route to submit a test result and record the user
app.post("/submittest", async (req, res) => {
  try {
    const testEntry = await TestModel.findOne({ testID: req.body.testid });
    if (!testEntry) return res.status(404).json({ message: "Test not found." });

    if (!testEntry.tookBy.includes(req.body.val)) {
      testEntry.tookBy.push(req.body.val);
      await testEntry.save();
    }

    res.json("User added to tookBy.");
  } catch (error) {
    console.error("Error updating test entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET route to find all tests taken by a user
app.get("/findtakentests", async (req, res) => {
  try {
    const takenTests = await TestModel.find({
      tookBy: { $elemMatch: { $regex: new RegExp(`^${req.query.user}/`, "i") } },
    });
    res.json(takenTests.length ? takenTests : { message: "No tests taken by this user." });
  } catch (error) {
    console.error("Error fetching test:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/me", isAuthenticated, (req, res) => {
  res.status(200).json(req.user);  // Send the authenticated user's data (including role)
});


app.use('/api/v1/projects', projectRoutes);




// Get all applications for a specific employee
app.get("/applications/me", async (req, res) => {
  try {
    const applications = await Application.find({ employee: req.user._id })
      .populate("job", "title companyName location salary") // Populates job details
      .sort({ appliedOn: -1 }); // Sorts by most recent applications

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching applications", error: err });
  }
});

