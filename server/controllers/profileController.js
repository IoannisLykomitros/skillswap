const { pool } = require('../config/database');

/**
 * Get a user's profile by ID
 * GET /api/profile/:userId
 * Returns: User info and their offered/wanted skills
 * Public route
 */
const getProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID. Please provide a valid numeric ID.'
      });
    }

    const userQuery = `
      SELECT 
        id, 
        email, 
        name, 
        bio, 
        location, 
        created_at, 
        updated_at
      FROM users
      WHERE id = $1
    `;

    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = userResult.rows[0];

    const skillsQuery = `
      SELECT 
        us.id as user_skill_id,
        s.id as skill_id,
        s.skill_name,
        s.category,
        us.type,
        us.proficiency_level
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.id
      WHERE us.user_id = $1
      ORDER BY us.type DESC, s.skill_name ASC
    `;

    const skillsResult = await pool.query(skillsQuery, [userId]);

    const offeredSkills = skillsResult.rows
      .filter(skill => skill.type === 'offer')
      .map(skill => ({
        userSkillId: skill.user_skill_id,
        skillId: skill.skill_id,
        skillName: skill.skill_name,
        category: skill.category,
        proficiencyLevel: skill.proficiency_level
      }));

    const wantedSkills = skillsResult.rows
      .filter(skill => skill.type === 'want')
      .map(skill => ({
        userSkillId: skill.user_skill_id,
        skillId: skill.skill_id,
        skillName: skill.skill_name,
        category: skill.category
      }));

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      profile: {
        id: user.id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        location: user.location,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        skills: {
          offered: offeredSkills,
          wanted: wantedSkills
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { getProfile };
