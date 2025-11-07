const { pool } = require('../config/database');

/**
 * Get all available skills in the system
 * GET /api/skills
 * Query params (optional):
 *   - category: Filter by category (e.g., ?category=Programming)
 *   - search: Search by skill name (e.g., ?search=java)
 *   - limit: Max number of results (default 100)
 *   - offset: Pagination offset (default 0)
 * Public route
 */
const getAllSkills = async (req, res) => {
  try {
    const { category, search, limit = 100, offset = 0 } = req.query;

    let limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum <= 0) {
      limitNum = 100;
    }
    limitNum = Math.min(limitNum, 500);

    let offsetNum = parseInt(offset);
    if (isNaN(offsetNum) || offsetNum < 0) {
      offsetNum = 0;
    }

    if (search && search.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Search term cannot exceed 100 characters'
      });
    }

    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    if (category) {
      whereConditions.push(`category = $${paramCount}`);
      queryParams.push(category);
      paramCount++;
    }

    if (search) {
      whereConditions.push(`skill_name ILIKE $${paramCount}`);
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    const countQuery = `
      SELECT COUNT(*) as total
      FROM skills
      ${whereClause}
    `;

    const countResult = await pool.query(countQuery, queryParams);
    const totalCount = parseInt(countResult.rows[0].total);

    const skillsQuery = `
      SELECT 
        id,
        skill_name,
        category,
        description,
        created_at
      FROM skills
      ${whereClause}
      ORDER BY skill_name ASC
      LIMIT $${paramCount}
      OFFSET $${paramCount + 1}
    `;

    const finalParams = [...queryParams, limitNum, offsetNum];
    const skillsResult = await pool.query(skillsQuery, finalParams);
    const skills = skillsResult.rows;

    const totalPages = Math.ceil(totalCount / limitNum);
    const currentPage = Math.floor(offsetNum / limitNum) + 1;
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    res.status(200).json({
      success: true,
      message: 'Skills retrieved successfully',
      data: {
        skills: skills.map(skill => ({
          id: skill.id,
          skillName: skill.skill_name,
          category: skill.category,
          description: skill.description,
          createdAt: skill.created_at
        })),
        pagination: {
          total: totalCount,
          limit: limitNum,
          offset: offsetNum,
          currentPage: currentPage,
          totalPages: totalPages,
          hasNextPage: hasNextPage,
          hasPreviousPage: hasPreviousPage
        }
      }
    });

  } catch (error) {
    console.error('Get all skills error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving skills',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all skills (offered and wanted) for a specific user
 * GET /api/skills/user/:userId
 * Params: userId (user id to fetch skills for)
 * Returns: User's offered and wanted skills
 * Public route (no authentication required)
 */
const getUserSkills = async (req, res) => {
  const { userId } = req.params;

  try {
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID. Please provide a valid numeric ID.'
      });
    }

    const userCheckQuery = 'SELECT id FROM users WHERE id = $1';
    const userCheckResult = await pool.query(userCheckQuery, [userId]);

    if (userCheckResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const skillsQuery = `
      SELECT 
        us.id as user_skill_id,
        s.id as skill_id,
        s.skill_name,
        s.category,
        us.type,
        us.proficiency_level,
        us.created_at
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.id
      WHERE us.user_id = $1
      ORDER BY us.type DESC, s.skill_name ASC
    `;

    const skillsResult = await pool.query(skillsQuery, [userId]);
    const allSkills = skillsResult.rows;

    const offeredSkills = allSkills
      .filter(skill => skill.type === 'offer')
      .map(skill => ({
        userSkillId: skill.user_skill_id,
        skillId: skill.skill_id,
        skillName: skill.skill_name,
        category: skill.category,
        proficiencyLevel: skill.proficiency_level,
        addedAt: skill.created_at
      }));

    const wantedSkills = allSkills
      .filter(skill => skill.type === 'want')
      .map(skill => ({
        userSkillId: skill.user_skill_id,
        skillId: skill.skill_id,
        skillName: skill.skill_name,
        category: skill.category,
        addedAt: skill.created_at
      }));

    res.status(200).json({
      success: true,
      message: 'User skills retrieved successfully',
      data: {
        userId: parseInt(userId),
        skills: {
          offered: offeredSkills,
          wanted: wantedSkills
        },
        summary: {
          totalOffered: offeredSkills.length,
          totalWanted: wantedSkills.length,
          total: allSkills.length
        }
      }
    });

  } catch (error) {
    console.error('Get user skills error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving user skills',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Add a skill to current user's profile
 * POST /api/skills/user
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { skill_id, type (offer/want), proficiency_level (optional) }
 * Protected route (authentication required)
 */
const addUserSkill = async (req, res) => {
  const userId = req.user.userId;
  const { skill_id, type, proficiency_level } = req.body;

  try {
    if (!skill_id || !type) {
      return res.status(400).json({
        success: false,
        message: 'skill_id and type are required'
      });
    }

    if (isNaN(skill_id) || skill_id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'skill_id must be a valid positive number'
      });
    }

    if (type !== 'offer' && type !== 'want') {
      return res.status(400).json({
        success: false,
        message: 'type must be either "offer" or "want"'
      });
    }

    const validProficiencyLevels = ['beginner', 'intermediate', 'advanced'];
    if (proficiency_level && !validProficiencyLevels.includes(proficiency_level)) {
      return res.status(400).json({
        success: false,
        message: 'proficiency_level must be one of: beginner, intermediate, advanced'
      });
    }

    if (type === 'want' && proficiency_level) {
      return res.status(400).json({
        success: false,
        message: 'proficiency_level cannot be set for "want" type skills'
      });
    }

    const skillCheckQuery = 'SELECT id FROM skills WHERE id = $1';
    const skillCheckResult = await pool.query(skillCheckQuery, [skill_id]);

    if (skillCheckResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    const duplicateCheckQuery = `
      SELECT id FROM user_skills 
      WHERE user_id = $1 AND skill_id = $2 AND type = $3
    `;
    const duplicateCheckResult = await pool.query(
      duplicateCheckQuery,
      [userId, skill_id, type]
    );

    if (duplicateCheckResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: `You already have this skill as a "${type}" skill`
      });
    }

    const insertQuery = `
      INSERT INTO user_skills (user_id, skill_id, type, proficiency_level)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, skill_id, type, proficiency_level, created_at
    `;

    const insertResult = await pool.query(insertQuery, [
      userId,
      skill_id,
      type,
      proficiency_level || null
    ]);

    const userSkill = insertResult.rows[0];

    const skillDetailsQuery = 'SELECT skill_name, category FROM skills WHERE id = $1';
    const skillDetailsResult = await pool.query(skillDetailsQuery, [skill_id]);
    const skillDetails = skillDetailsResult.rows[0];

    res.status(201).json({
      success: true,
      message: 'Skill added successfully',
      data: {
        userSkillId: userSkill.id,
        userId: userSkill.user_id,
        skillId: userSkill.skill_id,
        skillName: skillDetails.skill_name,
        category: skillDetails.category,
        type: userSkill.type,
        proficiencyLevel: userSkill.proficiency_level,
        createdAt: userSkill.created_at
      }
    });

  } catch (error) {
    console.error('Add user skill error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while adding the skill',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Remove a skill from current user's profile
 * DELETE /api/skills/user/:userSkillId
 * Headers: { Authorization: "Bearer <token>" }
 * Params: userSkillId (the id from user_skills table)
 * Protected route (authentication required)
 */
const removeUserSkill = async (req, res) => {
  const userId = req.user.userId;
  const { userSkillId } = req.params;

  try {
    if (isNaN(userSkillId) || userSkillId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user skill ID. Please provide a valid numeric ID.'
      });
    }

    const checkQuery = `
      SELECT 
        us.id,
        us.user_id,
        s.skill_name,
        us.type
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.id
      WHERE us.id = $1
    `;
    const checkResult = await pool.query(checkQuery, [userSkillId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User skill not found'
      });
    }

    const userSkill = checkResult.rows[0];

    if (userSkill.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this skill'
      });
    }

    const deleteQuery = `
      DELETE FROM user_skills
      WHERE id = $1
      RETURNING id, user_id, skill_id
    `;
    const deleteResult = await pool.query(deleteQuery, [userSkillId]);

    res.status(200).json({
      success: true,
      message: 'Skill removed successfully',
      data: {
        userSkillId: userSkill.id,
        skillName: userSkill.skill_name,
        type: userSkill.type,
        message: `You are no longer ${userSkill.type === 'offer' ? 'offering' : 'learning'} ${userSkill.skill_name}`
      }
    });

  } catch (error) {
    console.error('Remove user skill error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while removing the skill',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { getAllSkills, getUserSkills, addUserSkill, removeUserSkill };