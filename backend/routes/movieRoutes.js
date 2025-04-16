// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const MovieList = require('../models/MovieSchema'); // Ensure your Mongoose model is defined
const verifyToken = require('../verifyToken'); // Middleware to verify JWT

// GET movie lists for a user
router.get('/:userId', async (req, res) => {
  try {
    // Find the movie list document by user ID and populate the arrays
    const movieList = await MovieList.findOne({ user: req.params.userId })
      .populate('watchHistory favorites watchlist')
      .populate('continueWatching.movie');
    if (!movieList) {
      return res.status(404).json({ message: "Movie list not found for this user." });
    }
    res.status(200).json(movieList);
  } catch (error) {
    console.error("Error fetching movie list:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Create a new movie list for a user (if one doesn't exist)
router.post('/:userId', async (req, res) => {
  try {
    let movieList = await MovieList.findOne({ user: req.params.userId });
    if (movieList) {
      return res.status(400).json({ message: "Movie list already exists for this user." });
    }
    movieList = new MovieList({ user: req.params.userId });
    await movieList.save();
    res.status(201).json(movieList);
  } catch (error) {
    console.error("Error creating movie list:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Add a movie to a specific list (using a specific route)
router.post('/:userId/list/:listType', async (req, res) => {
  try {
    const { userId, listType } = req.params;
    let { movieId, progress } = req.body;
    
    // Convert movieId to string for consistent comparisons
    movieId = String(movieId);
    
    // Validate listType
    const validLists = ["continueWatching", "watchHistory", "favorites", "watchlist"];
    if (!validLists.includes(listType)) {
      return res.status(400).json({ message: "Invalid list type." });
    }
    
    let movieList = await MovieList.findOne({ user: userId });
    if (!movieList) {
      // Create a new movie list if one doesn't exist
      movieList = new MovieList({ user: userId });
    }
    
    if (listType === "continueWatching") {
      // Check if the movie is already in continueWatching list
      const index = movieList.continueWatching.findIndex(
        (item) => String(item.movie) === movieId
      );
      if (index === -1) {
        movieList.continueWatching.push({ movie: movieId, progress: progress || 0 });
      } else {
        // Update the progress if already exists
        movieList.continueWatching[index].progress = progress || movieList.continueWatching[index].progress;
        movieList.continueWatching[index].updatedAt = new Date();
      }
    } else {
      // For other lists, add movieId if not already included.
      if (!movieList[listType].includes(movieId)) {
        movieList[listType].push(movieId);
      }
    }
    
    await movieList.save();
    res.status(200).json(movieList);
  } catch (error) {
    console.error("Error updating movie list:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Remove a movie from a specific list
router.delete('/:userId/list/:listType/:movieId', async (req, res) => {
  try {
    const { userId, listType, movieId } = req.params;
    const movieIdStr = String(movieId);
    const validLists = ["continueWatching", "watchHistory", "favorites", "watchlist"];
    if (!validLists.includes(listType)) {
      return res.status(400).json({ message: "Invalid list type." });
    }
    
    const movieList = await MovieList.findOne({ user: userId });
    if (!movieList) {
      return res.status(404).json({ message: "Movie list not found for this user." });
    }
    
    if (listType === "continueWatching") {
      // Remove the movie from continueWatching
      movieList.continueWatching = movieList.continueWatching.filter(
        item => String(item.movie) !== movieIdStr
      );
    } else {
      // Remove the movie from the specified list
      movieList[listType] = movieList[listType].filter(id => String(id) !== movieIdStr);
    }
    
    await movieList.save();
    res.status(200).json(movieList);
  } catch (error) {
    console.error("Error removing movie from list:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
