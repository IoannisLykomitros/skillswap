const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getAllSkills } = require('../controllers/skillController');

// Controllers will be imported here (we'll create them next)
// const skillController = require('../controllers/skillController');

/**
 * GET /api/skills
 * Get all available skills in the system
 * Query params (optional):
 *   - category: Filter by category (e.g., ?category=Programming)
 *   - search: Search by skill name (e.g., ?search=java)
 * Public route (no authentication required)
 */
router.get('/', getAllSkills);

/**
 * GET /api/skills/user/:userId
 * Get all skills (offered and wanted) for a specific user
 * Params: userId (user id to fetch skills for)
 * Public route (no authentication required)
 */
router.get('/user/:userId', (req, res) => {
  res.status(200).json({
    message: 'Get user skills endpoint - implementation coming next',
    userId: req.params.userId
  });
});

/**
 * POST /api/skills/user
 * Add a skill to current user's profile
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { skill_id, type (offer/want), proficiency_level (optional) }
 * Protected route (authentication required)
 */
router.post('/user', authenticateToken, (req, res) => {
  res.status(201).json({
    message: 'Add user skill endpoint - implementation coming next',
    userId: req.user.userId
  });
});

/**
 * DELETE /api/skills/user/:userSkillId
 * Remove a skill from current user's profile
 * Headers: { Authorization: "Bearer <token>" }
 * Params: userSkillId (the id from user_skills table)
 * Protected route (authentication required)
 */
router.delete('/user/:userSkillId', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Delete user skill endpoint - implementation coming next',
    userSkillId: req.params.userSkillId,
    userId: req.user.userId
  });
});

module.exports = router;
