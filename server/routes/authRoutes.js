const express = require('express');
const router = express.Router();

// Authentication Routes

/**
 * POST /api/auth/register
 * Register a new user
 * Body: { email, password, name }
 */
router.post('/register', (req, res) => {
  res.status(200).json({ 
    message: 'Register endpoint',
    path: '/api/auth/register',
    method: 'POST'
  });
});

/**
 * POST /api/auth/login
 * Login an existing user
 * Body: { email, password }
 */
router.post('/login', (req, res) => {
  res.status(200).json({ 
    message: 'Login endpoint',
    path: '/api/auth/login',
    method: 'POST'
  });
});

module.exports = router;
