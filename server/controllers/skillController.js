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

module.exports = { getAllSkills };
