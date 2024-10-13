const express = require('express');
const router = express.Router();
const { loginController, registerController } = require('../controllers/userController');

// Define the routes
router.post("/login", loginController);
router.post("/register", registerController);

module.exports = router;
