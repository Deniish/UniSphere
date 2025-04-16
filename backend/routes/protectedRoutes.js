const express = require('express');
const router = express.Router();
const verifyToken = require('../verifyToken'); // Adjust the path accordingly

// Example of a protected route
router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'You have access to this protected route!', user: req.user });
});

module.exports = router;
