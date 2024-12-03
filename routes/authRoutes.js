const express = require('express');
const { loginAdmin, signupAdmin, deleteAllAdmins } = require('../controllers/authController');

const router = express.Router();

// Login route
router.post('/login', loginAdmin);

// Signup route
router.post('/signup', signupAdmin);

// Delete all admins route
router.delete('/delete-all', deleteAllAdmins);

module.exports = router;
