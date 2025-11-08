const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

const validateRegister = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email cannot exceed 255 characters'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .isLength({ max: 100 }).withMessage('Password cannot exceed 100 characters'),
  
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  handleValidationErrors
];

const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty if provided')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters'),
  
  handleValidationErrors
];

const validateAddUserSkill = [
  body('skill_id')
    .notEmpty().withMessage('skill_id is required')
    .isInt({ min: 1 }).withMessage('skill_id must be a positive integer'),
  
  body('type')
    .notEmpty().withMessage('type is required')
    .isIn(['offer', 'want']).withMessage('type must be either "offer" or "want"'),
  
  body('proficiency_level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced']).withMessage('proficiency_level must be beginner, intermediate, or advanced'),
  
  handleValidationErrors
];

const validateSendRequest = [
  body('receiver_id')
    .notEmpty().withMessage('receiver_id is required')
    .isInt({ min: 1 }).withMessage('receiver_id must be a positive integer'),
  
  body('skill_id')
    .notEmpty().withMessage('skill_id is required')
    .isInt({ min: 1 }).withMessage('skill_id must be a positive integer'),
  
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters'),
  
  handleValidationErrors
];

const validateIdParam = (paramName = 'id') => [
  param(paramName)
    .isInt({ min: 1 }).withMessage(`${paramName} must be a positive integer`),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateAddUserSkill,
  validateSendRequest,
  validateIdParam
};
