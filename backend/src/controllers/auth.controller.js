const userModel = require("../model/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../model/blacklist.model")

/** 
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request
 * @access Public
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        return res.status(400).json({
            message: " please provide username, email and password "
        })
    }
    const cleanUsername = username.trim()
    const cleanEmail = email.trim().toLowerCase()

    const isUserAlreadyExist = await userModel.findOne({
        $or: [{ username: cleanUsername }, { email: cleanEmail }]
    })

    if (isUserAlreadyExist) {
        return res.status(400).json({
            message: "Account already exists with this email address or username"
        })
    }
    const hash = await bcrypt.hash(password, 10)
    const user = await userModel.create({
        username: cleanUsername,
        email: cleanEmail,
        password: hash
    })
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
    res.cookie("token", token)
    res.status(201).json({
        message: "user registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}
/**
 * @name loginUserController
 * @description login a user, expects email/username and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            message: " please provide email/username and password "
        })
    }
    const cleanInput = email.trim()
    const cleanEmail = cleanInput.toLowerCase()

    const user = await userModel.findOne({
        $or: [
            { email: cleanEmail },
            { username: cleanInput }
        ]
    })

    if (!user) {
        console.log("Login fail: user not found in DB for input:", email)
        return res.status(400).json({
            message: " Invalid email/username or password"
        })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        console.log("Login fail: password invalid for user:", user.email)
        return res.status(400).json({
            message: "invalid email/username or password"
        })
    }
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
    res.cookie("token", token)
    res.status(200).json({
        message: " user loggedIn successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}
async function logoutUserController(req,res){
    const token = req.cookies.token
    if(token){
        await tokenBlacklistModel.create({token})
    }
    res.clearCookie("token")
    res.status(200).json({
        message :" user logged out successfully"
    })
}
/**
 * @name getMeController
 * @description get the current logged in user  details, 
 * @access private
 *
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id)
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }
    res.status(200).json({
        message: "user details feteched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}
module.exports = {
    registerUserController,
    loginUserController,                 
    logoutUserController,
    getMeController
}
