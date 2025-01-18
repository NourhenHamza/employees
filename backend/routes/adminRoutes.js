import express from 'express';
import {
    getAdminProfile,
    updateAdminProfile
} from '../controllers/adminController.js';
import { adminLogin } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

// Route for admin login
router.post('/login', adminLogin);

// Route for updating admin profile
router.put('/profile', isAuthenticated, updateAdminProfile); // Changed to '/profile'

 

// Route for getting the admin profile
router.get('/profile', isAuthenticated, getAdminProfile);

export default router;