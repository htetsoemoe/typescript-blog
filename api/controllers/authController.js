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