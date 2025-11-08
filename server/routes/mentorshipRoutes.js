const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { sendRequest } = require('../controllers/mentorshipController');

/**
 * GET /api/requests/sent
 * Get all mentorship requests sent by the current user
 * Headers: { Authorization: "Bearer <token>" }
 * Protected route (authentication required)
 */
router.get('/sent', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Get sent requests endpoint - implementation coming next',
    userId: req.user.userId
  });
});

/**
 * GET /api/requests/received
 * Get all mentorship requests received by the current user
 * Headers: { Authorization: "Bearer <token>" }
 * Protected route (authentication required)
 */
router.get('/received', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Get received requests endpoint - implementation coming next',
    userId: req.user.userId
  });
});

/**
 * POST /api/requests
 * Send a new mentorship request
 * Headers: { Authorization: "Bearer <token>" }
 * Body: { receiver_id, skill_id, message (optional) }
 * Protected route (authentication required)
 */
router.post('/', authenticateToken, sendRequest);

/**
 * PUT /api/requests/:requestId/accept
 * Accept a mentorship request
 * Headers: { Authorization: "Bearer <token>" }
 * Params: requestId (the request to accept)
 * Protected route (authentication required)
 */
router.put('/:requestId/accept', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Accept request endpoint - implementation coming next',
    requestId: req.params.requestId,
    userId: req.user.userId
  });
});

/**
 * PUT /api/requests/:requestId/decline
 * Decline a mentorship request
 * Headers: { Authorization: "Bearer <token>" }
 * Params: requestId (the request to decline)
 * Protected route (authentication required)
 */
router.put('/:requestId/decline', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Decline request endpoint - implementation coming next',
    requestId: req.params.requestId,
    userId: req.user.userId
  });
});

/**
 * PUT /api/requests/:requestId/complete
 * Mark a mentorship as completed
 * Headers: { Authorization: "Bearer <token>" }
 * Params: requestId (the request to complete)
 * Protected route (authentication required)
 */
router.put('/:requestId/complete', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Complete request endpoint - implementation coming next',
    requestId: req.params.requestId,
    userId: req.user.userId
  });
});

module.exports = router;
