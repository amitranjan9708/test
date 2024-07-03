const express = require("express");
const { loginController, registerController, fetchAllUsersController } = require("../Controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const Router = express.Router();

Router.get('/fetchUsers',fetchAllUsersController);
Router.post('/register',registerController);
Router.post('/login',loginController);


module.exports= Router;