const jwt = require('jsonwebtoken');
const User = require('./models/User');

const verifyToken = async (req, res, next) => {
  // Expect token in the format "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    // Verify token using the same secret key used when signing it
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'your-secret-key');

    // Retrieve user from the database using decoded token's id
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Access Denied. User not found.' });
    }

    // Check if the user is authenticated
    if (!user.isAuthenticated) {
      return res.status(401).json({ message: 'Access Denied. Please log in.' });
    }

    // Attach the user data to the request object for later use if needed
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token or session expired.' });
  }
};

module.exports = verifyToken;
