import { config } from 'dotenv';
config({ path: './.env' });  // Load environment variables from the .env file

export const mongoURI = process.env.MONGO_URI;
export const tOrKey = process.env.T_OR_KEY;
export const orgmail = process.env.ORG_MAIL;
export const orgpass = process.env.ORG_PASS;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
