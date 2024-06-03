import dotenv from 'dotenv'
import mysql from 'mysql'

dotenv.config()

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: 'blog_mysql_nodejs'
})
