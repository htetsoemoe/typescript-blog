import { db } from "../db.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// User Registration 
export const register = (req, res) => {
    // CHECK EXISTING USER
    const checkExistedUserQuery = "SELECT * FROM users WHERE email = ? OR username = ?"

    db.query(checkExistedUserQuery, [req.body.email, req.body.username], (err, data) => {
        if (err) return res.status(500).json(err)

        if (data.length) {
            return res.status(409).json({ message: "User already exists!" })
        }

        // Hash password and create a user
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(req.body.password, salt)

        const createNewUserQuery = "INSERT INTO users(`username`, `email`, `password`) values(?)"
        const values = [req.body.username, req.body.email, hashPassword]

        db.query(createNewUserQuery, [values], (err, data) => {
            if (err) return res.status(500).json(err)

            // If there is no error
            console.log(`Effected Row: ${data.affectedRows}`, `Inserted ID: ${data.insertId}`)
            return res.status(201).json({
                status: "success",
                message: "user has been created."
            })
        })
    })
}

// User Login
export const login = (req, res, next) => {
    // check there is already exists user
    const existedUser = "SELECT * FROM users WHERE username = ?"

    db.query(existedUser, [req.body.username], (err, data) => {
        if (err) return res.status(500).json()
        if (data.length === 0) return res.status(404).json({ message: "User not found!" }) // returned data is an array

        let user = data[0]
        // res.status(200).json(user.password)

        // check password
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Wrong Password" })
        }

        // generate JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
        // remove password
        const { password, ...rest } = user

        res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200)
            .json(rest)
    })
}

// User Logout
export const logout = (req, res) => {
    res
        .clearCookie("access_token", {
            sameSite: "none",
            secure: true,
        })
        .status(200)
        .json({ message: "User has been logged out." })
}