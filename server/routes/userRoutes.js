const express = require('express');
const { userValidators } = require('../middleware/validators');
const router = express.Router();
const {
    createUser,
    getUsers,
    getUserById,
    updateUserBalance,
    deleteUser
} = require('../controllers/userController');

// Create new user
router.post('/', createUser);

// Get all users
router.get('/', getUsers);

// Get single user
router.get('/:id', getUserById);

// Update balance
router.put('/:id/balance', updateUserBalance);

// Delete user
router.delete('/:id', deleteUser);   

module.exports = router;