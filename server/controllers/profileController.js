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
/**
 * Update current user's profile
 * PUT /api/profile
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { name, bio, location }
 * Protected route (authentication required)
 */
const updateProfile = async (req, res) => {
  const userId = req.user.userId;
  const { name, bio, location } = req.body;

  try {
    if (!name && !bio && !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field to update (name, bio, or location)'
      });
    }

    if (name !== undefined && (!name || name.trim() === '')) {
      return res.status(400).json({
        success: false,
        message: 'Name cannot be empty'
      });
    }

    if (bio !== undefined && bio.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Bio cannot exceed 500 characters'
      });
    }

    if (location !== undefined && location.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Location cannot exceed 100 characters'
      });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name.trim());
      paramCount++;
    }

    if (bio !== undefined) {
      updates.push(`bio = $${paramCount}`);
      values.push(bio);
      paramCount++;
    }

    if (location !== undefined) {
      updates.push(`location = $${paramCount}`);
      values.push(location);
      paramCount++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const updateQuery = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, name, bio, location, created_at, updated_at
    `;

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updatedUser = result.rows[0];

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        bio: updatedUser.bio,
        location: updatedUser.location,
        createdAt: updatedUser.created_at,
        updatedAt: updatedUser.updated_at
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { getProfile, updateProfile };
