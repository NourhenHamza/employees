import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

export const sendInvitationEmail = async (email, jobSeekerId) => {
  try {
    console.log('Attempting to connect to Gmail...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    console.log('Creating email options...');
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Invitation to Complete Your Registration',
      text: `Hello,\n\nYou are invited to complete your registration on our platform. Click here to get started: ${process.env.FRONTEND_URL}/Employer-form/${jobSeekerId}. \n\nPlease log in and update your profile.`,
    };

    console.log('Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

  } catch (error) {
    console.error('Error sending email:', error);
  }
};
