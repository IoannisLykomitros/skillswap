const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
     sendRequest,
     getSentRequests,
     getReceivedRequests
} = require('../controllers/mentorshipController');

/**
 * GET /api/requests/sent
 * Get all mentorship requests sent by the current user
 */
router.get('/sent', authenticateToken, getSentRequests);

/**
 * GET /api/requests/received
 * Get all mentorship requests received by the current user
 */
router.get('/received', authenticateToken, getReceivedRequests);

/**
 * POST /api/requests
 * Send a new mentorship request
 */
router.post('/', authenticateToken, sendRequest);

/**
 * PUT /api/requests/:requestId/accept
 * Accept a mentorship request
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
 */
router.put('/:requestId/complete', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Complete request endpoint - implementation coming next',
    requestId: req.params.requestId,
    userId: req.user.userId
  });
});

module.exports = router;
