// userRoutes.js
const express = require('express');
const CryptoJS = require('crypto-js'); // Make sure CryptoJS is installed
const User = require('../models/User');
const router = express.Router();

// GET /user endpoint: fetch a user by email
router.get('/user', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Remove sensitive data (e.g., password) from the response
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /reset-password endpoint: update the user's password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }
    
    // Encrypt the new password using CryptoJS
    const secretKey = process.env.SECRET_KEY || 'your-secret-key';
    const encryptedPassword = CryptoJS.AES.encrypt(newPassword, secretKey).toString();
    
    // Update the password in the user document
    user.password = encryptedPassword;
    await user.save();
    
    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Server error during password reset." });
  }
});

module.exports = router;
