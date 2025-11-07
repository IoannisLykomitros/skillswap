const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getProfile } = require('../controllers/profileController');

/**
 * GET /api/profile/:userId
 * Get a user's profile by ID
 * Params: userId (user id to fetch)
 * Returns: User info and their offered/wanted skills
 * Public route (no authentication required to view profiles)
 */
router.get('/:userId', getProfile);

/**
 * PUT /api/profile
 * Update current user's profile
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { name, bio, location }
 * Protected route (authentication required)
 */
router.put('/', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Update profile endpoint',
    userId: req.user.userId
  });
});

module.exports = router;
