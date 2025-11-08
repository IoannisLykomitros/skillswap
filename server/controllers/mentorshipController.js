const { pool } = require('../config/database');

/**
 * Send a new mentorship request
 * POST /api/requests
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { receiver_id, skill_id, message (optional) }
 * Protected route (authentication required)
 */
const sendRequest = async (req, res) => {
  const senderId = req.user.userId;
  const { receiver_id, skill_id, message } = req.body;

  try {
    if (!receiver_id || !skill_id) {
      return res.status(400).json({
        success: false,
        message: 'receiver_id and skill_id are required'
      });
    }

    if (isNaN(receiver_id) || receiver_id <= 0 || isNaN(skill_id) || skill_id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'receiver_id and skill_id must be valid positive numbers'
      });
    }

    if (senderId === parseInt(receiver_id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a mentorship request to yourself'
      });
    }

    if (message && message.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot exceed 500 characters'
      });
    }

    const receiverCheckQuery = 'SELECT id, name FROM users WHERE id = $1';
    const receiverCheckResult = await pool.query(receiverCheckQuery, [receiver_id]);

    if (receiverCheckResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Receiver user not found'
      });
    }

    const receiver = receiverCheckResult.rows[0];

    const skillCheckQuery = 'SELECT id, skill_name FROM skills WHERE id = $1';
    const skillCheckResult = await pool.query(skillCheckQuery, [skill_id]);

    if (skillCheckResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    const skill = skillCheckResult.rows[0];

    const receiverSkillCheckQuery = `
      SELECT id FROM user_skills 
      WHERE user_id = $1 AND skill_id = $2 AND type = 'offer'
    `;
    const receiverSkillCheckResult = await pool.query(
      receiverSkillCheckQuery,
      [receiver_id, skill_id]
    );

    if (receiverSkillCheckResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: `${receiver.name} does not offer ${skill.skill_name}`
      });
    }

    const duplicateCheckQuery = `
      SELECT id FROM requests 
      WHERE sender_id = $1 
        AND receiver_id = $2 
        AND skill_id = $3 
        AND status = 'pending'
    `;
    const duplicateCheckResult = await pool.query(
      duplicateCheckQuery,
      [senderId, receiver_id, skill_id]
    );

    if (duplicateCheckResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: `You already have a pending request to ${receiver.name} for ${skill.skill_name}`
      });
    }

    const insertQuery = `
      INSERT INTO requests (sender_id, receiver_id, skill_id, message, status)
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING id, sender_id, receiver_id, skill_id, message, status, created_at
    `;

    const insertResult = await pool.query(insertQuery, [
      senderId,
      receiver_id,
      skill_id,
      message || null
    ]);

    const request = insertResult.rows[0];

    res.status(201).json({
      success: true,
      message: 'Mentorship request sent successfully',
      data: {
        requestId: request.id,
        sender: {
          id: senderId
        },
        receiver: {
          id: receiver.id,
          name: receiver.name
        },
        skill: {
          id: skill.id,
          skillName: skill.skill_name
        },
        message: request.message,
        status: request.status,
        createdAt: request.created_at
      }
    });

  } catch (error) {
    console.error('Send request error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while sending the mentorship request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { sendRequest };
