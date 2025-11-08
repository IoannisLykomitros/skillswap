const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    sendRequest,
    getSentRequests,
    getReceivedRequests,
    acceptRequest,
    declineRequest,
    completeRequest
} = require('../controllers/mentorshipController');
const { validateSendRequest, validateIdParam } = require('../middleware/validation');

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
router.post('/', authenticateToken, validateSendRequest, sendRequest);
/**
 * PUT /api/requests/:requestId/accept
 * Accept a mentorship request
 */
router.put('/:requestId/accept', authenticateToken, validateIdParam('requestId'), acceptRequest);
/**
 * PUT /api/requests/:requestId/decline
 * Decline a mentorship request
 */
router.put('/:requestId/decline', authenticateToken, validateIdParam('requestId'), declineRequest);
/**
 * PUT /api/requests/:requestId/complete
 * Mark a mentorship as completed
 */
router.put('/:requestId/complete', authenticateToken, validateIdParam('requestId'), completeRequest);

module.exports = router;
