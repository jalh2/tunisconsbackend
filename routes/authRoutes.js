const express = require('express');
const { loginAdmin, signupAdmin } = require('../controllers/authController');

const router = express.Router();

// Login route
router.post('/login', loginAdmin);

// Signup route
router.post('/signup', signupAdmin);

module.exports = router;
