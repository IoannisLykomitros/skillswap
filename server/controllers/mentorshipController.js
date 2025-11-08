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

/**
 * Get all mentorship requests sent by the current user
 * GET /api/requests/sent
 * Headers: { Authorization: "Bearer <token>" }
 * Protected route (authentication required)
 */
const getSentRequests = async (req, res) => {
  const userId = req.user.userId;

  try {
    const query = `
      SELECT 
        r.id,
        r.sender_id,
        r.receiver_id,
        r.skill_id,
        r.message,
        r.status,
        r.created_at,
        r.updated_at,
        r.completed_at,
        u.name as receiver_name,
        u.email as receiver_email,
        s.skill_name,
        s.category as skill_category
      FROM requests r
      JOIN users u ON r.receiver_id = u.id
      JOIN skills s ON r.skill_id = s.id
      WHERE r.sender_id = $1
      ORDER BY 
        CASE r.status
          WHEN 'pending' THEN 1
          WHEN 'accepted' THEN 2
          WHEN 'completed' THEN 3
          WHEN 'declined' THEN 4
        END,
        r.created_at DESC
    `;

    const result = await pool.query(query, [userId]);
    const requests = result.rows;

    const organized = {
      pending: [],
      accepted: [],
      declined: [],
      completed: []
    };

    requests.forEach(req => {
      const requestData = {
        requestId: req.id,
        receiver: {
          id: req.receiver_id,
          name: req.receiver_name,
          email: req.receiver_email
        },
        skill: {
          id: req.skill_id,
          skillName: req.skill_name,
          category: req.skill_category
        },
        message: req.message,
        status: req.status,
        createdAt: req.created_at,
        updatedAt: req.updated_at,
        completedAt: req.completed_at
      };

      organized[req.status].push(requestData);
    });

    const summary = {
      total: requests.length,
      pending: organized.pending.length,
      accepted: organized.accepted.length,
      declined: organized.declined.length,
      completed: organized.completed.length
    };

    res.status(200).json({
      success: true,
      message: 'Sent requests retrieved successfully',
      data: {
        requests: organized,
        summary: summary
      }
    });

  } catch (error) {
    console.error('Get sent requests error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving sent requests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all mentorship requests received by the current user
 * GET /api/requests/received
 * Headers: { Authorization: "Bearer <token>" }
 * Protected route (authentication required)
 */
const getReceivedRequests = async (req, res) => {
  const userId = req.user.userId;

  try {
    const query = `
      SELECT 
        r.id,
        r.sender_id,
        r.receiver_id,
        r.skill_id,
        r.message,
        r.status,
        r.created_at,
        r.updated_at,
        r.completed_at,
        u.name as sender_name,
        u.email as sender_email,
        s.skill_name,
        s.category as skill_category
      FROM requests r
      JOIN users u ON r.sender_id = u.id
      JOIN skills s ON r.skill_id = s.id
      WHERE r.receiver_id = $1
      ORDER BY 
        CASE r.status
          WHEN 'pending' THEN 1
          WHEN 'accepted' THEN 2
          WHEN 'completed' THEN 3
          WHEN 'declined' THEN 4
        END,
        r.created_at DESC
    `;

    const result = await pool.query(query, [userId]);
    const requests = result.rows;

    const organized = {
      pending: [],
      accepted: [],
      declined: [],
      completed: []
    };

    requests.forEach(req => {
      const requestData = {
        requestId: req.id,
        sender: {
          id: req.sender_id,
          name: req.sender_name,
          email: req.sender_email
        },
        skill: {
          id: req.skill_id,
          skillName: req.skill_name,
          category: req.skill_category
        },
        message: req.message,
        status: req.status,
        createdAt: req.created_at,
        updatedAt: req.updated_at,
        completedAt: req.completed_at
      };

      organized[req.status].push(requestData);
    });

    const summary = {
      total: requests.length,
      pending: organized.pending.length,
      accepted: organized.accepted.length,
      declined: organized.declined.length,
      completed: organized.completed.length
    };

    res.status(200).json({
      success: true,
      message: 'Received requests retrieved successfully',
      data: {
        requests: organized,
        summary: summary
      }
    });

  } catch (error) {
    console.error('Get received requests error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving received requests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Accept a mentorship request
 * PUT /api/requests/:requestId/accept
 * Headers: { Authorization: "Bearer <token>" }
 * Params: requestId (the request to accept)
 * Protected route (authentication required)
 */
const acceptRequest = async (req, res) => {
  const userId = req.user.userId;
  const { requestId } = req.params;

  try {
    if (isNaN(requestId) || requestId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID'
      });
    }

    const getRequestQuery = `
      SELECT 
        r.id,
        r.sender_id,
        r.receiver_id,
        r.status,
        u.name as sender_name,
        s.skill_name
      FROM requests r
      JOIN users u ON r.sender_id = u.id
      JOIN skills s ON r.skill_id = s.id
      WHERE r.id = $1
    `;

    const requestResult = await pool.query(getRequestQuery, [requestId]);

    if (requestResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    const request = requestResult.rows[0];

    if (request.receiver_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the receiver can accept this request'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot accept a ${request.status} request. Only pending requests can be accepted.`
      });
    }

    const updateQuery = `
      UPDATE requests
      SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, status, updated_at
    `;

    const updateResult = await pool.query(updateQuery, [requestId]);
    const updatedRequest = updateResult.rows[0];

    res.status(200).json({
      success: true,
      message: 'Mentorship request accepted successfully',
      data: {
        requestId: updatedRequest.id,
        status: updatedRequest.status,
        updatedAt: updatedRequest.updated_at,
        message: `You accepted ${request.sender_name}'s request to learn ${request.skill_name}`
      }
    });

  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while accepting the request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Decline a mentorship request
 * PUT /api/requests/:requestId/decline
 * Headers: { Authorization: "Bearer <token>" }
 * Params: requestId (the request to decline)
 * Protected route (authentication required)
 */
const declineRequest = async (req, res) => {
  const userId = req.user.userId;
  const { requestId } = req.params;

  try {
    if (isNaN(requestId) || requestId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID'
      });
    }

    const getRequestQuery = `
      SELECT 
        r.id,
        r.sender_id,
        r.receiver_id,
        r.status,
        u.name as sender_name,
        s.skill_name
      FROM requests r
      JOIN users u ON r.sender_id = u.id
      JOIN skills s ON r.skill_id = s.id
      WHERE r.id = $1
    `;

    const requestResult = await pool.query(getRequestQuery, [requestId]);

    if (requestResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    const request = requestResult.rows[0];

    if (request.receiver_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the receiver can decline this request'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot decline a ${request.status} request. Only pending requests can be declined.`
      });
    }

    const updateQuery = `
      UPDATE requests
      SET status = 'declined', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, status, updated_at
    `;

    const updateResult = await pool.query(updateQuery, [requestId]);
    const updatedRequest = updateResult.rows[0];

    res.status(200).json({
      success: true,
      message: 'Mentorship request declined',
      data: {
        requestId: updatedRequest.id,
        status: updatedRequest.status,
        updatedAt: updatedRequest.updated_at,
        message: `You declined ${request.sender_name}'s request to learn ${request.skill_name}`
      }
    });

  } catch (error) {
    console.error('Decline request error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while declining the request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Mark a mentorship as completed
 * PUT /api/requests/:requestId/complete
 * Headers: { Authorization: "Bearer <token>" }
 * Params: requestId (the request to complete)
 * Protected route (authentication required)
 */
const completeRequest = async (req, res) => {
  const userId = req.user.userId;
  const { requestId } = req.params;

  try {
    if (isNaN(requestId) || requestId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID'
      });
    }

    const getRequestQuery = `
      SELECT 
        r.id,
        r.sender_id,
        r.receiver_id,
        r.status,
        u1.name as sender_name,
        u2.name as receiver_name,
        s.skill_name
      FROM requests r
      JOIN users u1 ON r.sender_id = u1.id
      JOIN users u2 ON r.receiver_id = u2.id
      JOIN skills s ON r.skill_id = s.id
      WHERE r.id = $1
    `;

    const requestResult = await pool.query(getRequestQuery, [requestId]);

    if (requestResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    const request = requestResult.rows[0];

    if (request.sender_id !== userId && request.receiver_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only participants can mark this mentorship as completed'
      });
    }

    if (request.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: `Cannot complete a ${request.status} request. Only accepted requests can be completed.`
      });
    }

    const updateQuery = `
      UPDATE requests
      SET 
        status = 'completed', 
        updated_at = CURRENT_TIMESTAMP,
        completed_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, status, updated_at, completed_at
    `;

    const updateResult = await pool.query(updateQuery, [requestId]);
    const updatedRequest = updateResult.rows[0];

    res.status(200).json({
      success: true,
      message: 'Mentorship marked as completed successfully',
      data: {
        requestId: updatedRequest.id,
        status: updatedRequest.status,
        updatedAt: updatedRequest.updated_at,
        completedAt: updatedRequest.completed_at,
        message: `Mentorship session for ${request.skill_name} marked as completed`
      }
    });

  } catch (error) {
    console.error('Complete request error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while completing the request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { 
  sendRequest, 
  getSentRequests, 
  getReceivedRequests,
  acceptRequest,
  declineRequest,
  completeRequest
};



