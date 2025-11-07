const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token
 * @param {number} userId - User ID
 * @param {string} email - User email
 * @returns {string} JWT token
 */
const generateToken = (userId, email) => {
  try {
    const token = jwt.sign(
      {
        userId: userId,
        email: email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h'
      }
    );
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error.message);
    throw error;
  }
};

module.exports = { generateToken, verifyToken };
