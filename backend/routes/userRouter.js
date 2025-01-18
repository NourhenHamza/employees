import express from 'express'; // Assurez-vous d'importer express
import multer from 'multer';
import {
  completeEmployerProfile,
  createUserEmployer,
  deleteConfirmedEmployer,
  deleteProvisionalEmployer,
  getEmployerDetails,
  getProvisionalEmployer,
  getUser,
  login,
  logout,
  register,
  updateEmployer,
  updatePassword,
  updateUserProfile,
  getUserProfile
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { ProvisionalEmployer } from '../models/provisionalEmployer.js';
import { User } from '../models/userSchema.js';
import { sendInvitationEmail } from '../services/emailService.js';


// Initialisation du routeur express
const router = express.Router(); 

 
router.delete('/provisional-Employer/:id',deleteProvisionalEmployer );



// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");  // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });




// Route pour compléter le profil du job seeker
 

router.post('/complete-profile-Employer', completeEmployerProfile);



 

 


 

 

// Route for user registration
router.post("/register", register); 

// Route for user login
router.post("/login", login); 
 

// Route for logging out
router.get("/logout", isAuthenticated, logout); 

// Route for getting user details
router.get("/getuser", isAuthenticated, getUser); 

// In your route, apply the upload middleware
router.put("/update/profile", isAuthenticated, upload.single("resume"), updateUserProfile);
router.get("/me", isAuthenticated, getUserProfile);

// Route for updating user password
router.put("/update/password", isAuthenticated, updatePassword); 



/*/Route for creating a provisional job seeker*
router.post('/provisional-job-seeker', async (req, res) => {
  try {
    const { name, address, phone, password, email } = req.body; // Get data from the request body

    // Check if the email is already registered
    const existingJobSeeker = await ProvisionalJobSeeker.findOne({ email });
    if (existingJobSeeker) {
      return res.status(400).json({ message: 'Email is already registered.' }); // Return error message if email is already taken
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // The second parameter (10) is the salt rounds

    // Create a new provisional job seeker with hashed password
    const newProvisionalJobSeeker = new ProvisionalJobSeeker({
      name,
      address,
      phone,
      password: hashedPassword, // Save the hashed password
      email,
    });

    // Save the job seeker to the database
    await newProvisionalJobSeeker.save();

    // Respond with the created job seeker
    res.status(201).json(newProvisionalJobSeeker);
  } catch (error) {
    console.error('Error creating provisional job seeker:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
*/


 

 

 



 


 // Route to fetch all provisional employers
router.get('/provisional-employer', async (req, res) => {
  try {
    const employers = await ProvisionalEmployer.find();
    res.status(200).json(employers);
  } catch (error) {
    console.error('Error fetching provisional employers:', error);
    res.status(500).json({ message: 'Failed to fetch provisional employers.' });
  }
});

// Route to create a provisional employer
router.post('/provisional-employer', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the provisional employer already exists
    const existingEmployer = await ProvisionalEmployer.findOne({ email });
    if (existingEmployer) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Create a new provisional employer
    const newProvisionalEmployer = new ProvisionalEmployer({ email });
    await newProvisionalEmployer.save();

    console.log('Sending invitation email...');

    try {
      // Send an invitation email
      await sendInvitationEmail(email, newProvisionalEmployer._id);
      console.log('Invitation email sent successfully.');
      res.status(201).json({
        message: 'Employer created and invitation email sent successfully!',
        data: newProvisionalEmployer,
      });
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);
      res.status(201).json({
        message: 'Employer created but invitation email failed to send.',
        data: newProvisionalEmployer,
      });
    }
  } catch (error) {
    console.error('Error creating provisional employer:', error);
    res.status(500).json({ message: 'Server error while creating employer.' });
  }
});

// Route to fetch all confirmed employers
router.get('/employer', async (req, res) => {
  try {
    const employers = await User.find({ role: 'Employer' });
    res.status(200).json(employers);
  } catch (error) {
    console.error('Error fetching confirmed employers:', error);
    res.status(500).json({ message: 'Error fetching employers.' });
  }
});
 





/*router.post('/provisional-job-seeker', async (req, res) => {
  try {
    const { firstNiche, secondNiche, thirdNiche, resume, coverLetter, password } = req.body;
    const role = 'Job Seeker'; // Définir le rôle par défaut

    // Vérifiez que les informations nécessaires sont présentes
    if (!password || !firstNiche || !secondNiche || !thirdNiche || !resume) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Créer un nouvel utilisateur
    const newUser = new User({
      firstNiche,
      secondNiche,
      thirdNiche,
      resume,
      coverLetter,
      password,
      role, // Définir le rôle
    });

    // Enregistrez l'utilisateur dans la base de données
    await newUser.save();

    // Réponse après création de l'utilisateur
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating provisional job seeker:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

 */


// Route pour créer un nouvel utilisateur
router.post('/createUserEmployer', createUserEmployer);



// Récupérer un job seeker provisoire par ID
router.get('/provisional-Employer/:id', getProvisionalEmployer);


router.delete('/Employer/:id', deleteConfirmedEmployer);


// Route for confirmed employer
 

router.get('/Employer/:id', getEmployerDetails);

router.put('/Employer/:id', updateEmployer);
 

export default router;


