const express = require('express');
const authController = require('../controllers/auth.controller')

const { isAuthenticated } = require('../middleware/jwt.middleware.js');

const router = express.Router();

// POST /signup  - Creates a new user in the database
router.post('/signup', authController.postSignUp )

// POST  /auth/login - Verifies email and password and returns a JWT
router.post('/login', authController.postLogIn)
	

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get('/verify', isAuthenticated, authController.get)

module.exports = router;
