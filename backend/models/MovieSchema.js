// models/MovieSchema.js
const mongoose = require('mongoose');

// Define a subdocument schema for continue watching entries
const continueWatchingSchema = new mongoose.Schema({
  movie: {
    type: String, // Changed from ObjectId to String for TMDb movie IDs
    required: true
  },
  progress: {
    type: Number,
    default: 0  // e.g., percentage watched, or time in seconds
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const movieSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  continueWatching: [continueWatchingSchema],
  watchHistory: [{
    type: String  // Changed from ObjectId to String
  }],
  favorites: [{
    type: String  // Changed from ObjectId to String
  }],
  watchlist: [{
    type: String  // Changed from ObjectId to String
  }]
}, { timestamps: true });

module.exports = mongoose.model('MovieSchema', movieSchema);
