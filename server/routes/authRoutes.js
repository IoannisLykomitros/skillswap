const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// Authentication Routes

/**
 * POST /api/auth/register
 * Register a new user
 * Body: { email, password, name }
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Login an existing user
 * Body: { email, password }
 */
router.post('/login', login);

module.exports = router;
