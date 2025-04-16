require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware: enable CORS for your frontend and parse JSON bodies
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());

// Connect to MongoDB Atlas using environment variable
const mongoURI = process.env.MONGO_URL;
mongoose.connect(mongoURI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import routes
const authRoutes = require('./routes/authRoutes'); // Authentication routes (login/signup, etc.)
const userRoutes = require('./routes/userRoutes');   // User-specific endpoints
const protectedRoutes = require('./routes/protectedRoutes'); // Protected routes (using JWT or similar)
const movieRoutes = require('./routes/movieRoutes'); // New routes for movie lists (continue watching, history, favorites, watchlist)

// Use routes
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', protectedRoutes);
app.use('/movies', movieRoutes); // All movie-related routes will be under /movies

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
