const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getAllSkills, getUserSkills, addUserSkill, removeUserSkill } = require('../controllers/skillController');
const { validateAddUserSkill, validateIdParam } = require('../middleware/validation');

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
router.get('/user/:userId', validateIdParam('userId'), getUserSkills);

/**
 * POST /api/skills/user
 * Add a skill to current user's profile
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { skill_id, type (offer/want), proficiency_level (optional) }
 * Protected route (authentication required)
 */
router.post('/user', authenticateToken, validateAddUserSkill, addUserSkill);

/**
 * DELETE /api/skills/user/:userSkillId
 * Remove a skill from current user's profile
 * Headers: { Authorization: "Bearer <token>" }
 * Params: userSkillId (the id from user_skills table)
 * Protected route (authentication required)
 */
router.delete('/user/:userSkillId', authenticateToken, validateIdParam('userSkillId'), removeUserSkill);

module.exports = router;
