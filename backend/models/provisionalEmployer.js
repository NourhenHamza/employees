// In models/provisionalJobSeeker.js
import mongoose from 'mongoose';

const provisionalEmployerSchema = new mongoose.Schema({
   
  email: { type: String, required: true },
   
});

export const ProvisionalEmployer = mongoose.model('ProvisionalEmployer', provisionalEmployerSchema);

 
