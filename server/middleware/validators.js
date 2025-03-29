// server/middleware/validators.js
const { check } = require('express-validator');

const userValidators = [
    check('username')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
        .trim()
        .escape(),
        
    check('email')
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail(),
        
    check('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .optional(),
        
    check('name')
        .trim()
        .escape()
        .optional()
];

module.exports = { userValidators };