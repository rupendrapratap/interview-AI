const express = require('express')
const authRouter = express.Router()
const authcontroller = require("../controllers/auth.controller")
const authmiddleware = require("../middleware/auth.middleware")
const cookieParser = require("cookie-parser")

/**
 * @route POST /api/auth/register
 * @description REGISTER a new user
 * @access Public
 */
authRouter.post("/register", authcontroller.registerUserController)

/**
 * @route POST /api/auth/login
 * @description LOGIN a user
 * @access Public
 */
authRouter.post("/login", authcontroller.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
authRouter.get("/logout", authcontroller.logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details 
 * @access private
 */
authRouter.get("/get-me", authmiddleware.authUser, authcontroller.getMeController)

   module.exports = authRouter