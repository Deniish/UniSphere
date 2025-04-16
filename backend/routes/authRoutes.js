const express = require('express');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct
const verifyToken = require('../verifyToken'); // Middleware to verify JWT

const router = express.Router();

// LOGIN endpoint with decryption, JWT generation, and login status update
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    // Find the user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });
    
    if (!user) {
      return res.status(400).json({ message: "User not found. Please sign up first." });
    }
    
    // --- Decryption Logic ---
    const secretKey = process.env.SECRET_KEY || 'your-secret-key';
    const bytes = CryptoJS.AES.decrypt(user.password, secretKey);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
    // --- End Decryption Logic ---
    
    // Compare the provided password with the decrypted password
    if (password !== decryptedPassword) {
      return res.status(400).json({ message: "Invalid credentials. Please try again." });
    }
    
    // Update login status, last login time, and isAuthenticated flag
    user.loggedIn = true;
    user.isAuthenticated = true;
    user.lastLogin = new Date();
    await user.save();
    
    // Generate JWT access token
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY || 'your-secret-key',
      { expiresIn: "5d" }
    );
    
    // Remove the password before sending the response
    const { password: pwd, ...userWithoutPassword } = user.toObject();
    
    res.status(200).json({ message: "Login successful", user: userWithoutPassword, accessToken });
    
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// SIGNUP endpoint (for reference)
router.post('/signup', async (req, res) => {
  try {
    const { email, password, username, birthdate } = req.body;
    
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email Account is already registered" });
    }
    
    // Optionally check username too:
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }
    
    // Encrypt the password using CryptoJS
    const secretKey = process.env.SECRET_KEY || 'your-secret-key';
    const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
    
    // Create a new user; loggedIn and isAuthenticated default to false
    const newUser = new User({
      email,
      password: encryptedPassword,
      username,
      birthdate,
      loggedIn: false,
      isAuthenticated: false
    });
    
    await newUser.save();
    
    res.status(201).json({ message: "Signup successful", user: newUser });
    
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// /me endpoint to get the currently authenticated user
router.get('/me', async (req, res) => {
  try {
    // For a secure solution, you would verify a JWT token here.
    // This is a simplified example that finds a user with isAuthenticated: true.
    const user = await User.findOne({ isAuthenticated: true });
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE USERNAME endpoint
router.put('/update-username', verifyToken, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "Username is required" });
    }

    // Check if another user already has this username
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== req.user.id.toString()) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.username = username;
    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ message: "Username updated successfully", user: userWithoutPassword });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ message: "Server error updating username" });
  }
});

// LOGOUT endpoint: Sets loggedIn and isAuthenticated flags to false
router.post('/logout', verifyToken, async (req, res) => {
  try {
    console.log("User ID from token:", req.user.id);
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    user.loggedIn = false;
    user.isAuthenticated = false;
    await user.save();
    console.log("User after logout update:", user);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
});


router.post('/verify-password', verifyToken, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.trim() === "") {
      return res.status(400).json({ message: "Password is required" });
    }

    const secretKey = process.env.SECRET_KEY || 'your-secret-key';
    // Find the user by ID from the token
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Decrypt the stored password
    const bytes = CryptoJS.AES.decrypt(user.password, secretKey);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    // Compare the provided password with the decrypted password
    if (password === decryptedPassword) {
      return res.status(200).json({ valid: true });
    } else {
      return res.status(400).json({ valid: false, message: "Password does not match" });
    }
  } catch (error) {
    console.error("Error verifying password:", error);
    res.status(500).json({ message: "Server error verifying password" });
  }
});

// DELETE ACCOUNT endpoint
// DELETE ACCOUNT endpoint
router.delete('/delete-account', verifyToken, async (req, res) => {
  try {
    // Find the user by the id stored in the token
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    // Set isAuthenticated flag to false
    user.isAuthenticated = false;
    await user.save();

    // Now delete the user
    await User.findByIdAndDelete(req.user.id);

    // Send response with a redirect URL
    res.status(200).json({ 
      message: "Account deleted successfully", 
      redirect: "/" 
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Server error deleting account" });
  }
});

module.exports = router;
