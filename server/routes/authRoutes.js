const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Authentication Routes

/**
 * POST /api/auth/register
 * Register a new user
 * Body: { email, password, name }
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Login an existing user
 * Body: { email, password }
 */
router.post('/login', login);

/**
 * POST /api/auth/logout
 * Logout (protected route)
 * Headers: { Authorization: "Bearer <token>" }
 */
router.post('/logout', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful. Please remove the token from client storage.'
  });
});

/**
 * GET /api/auth/me
 * Get current user info (protected route)
 * Headers: { Authorization: "Bearer <token>" }
 */
router.get('/me', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User info retrieved successfully',
    user: {
      userId: req.user.userId,
      email: req.user.email
    }
  });
});

module.exports = router;
