import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoute.js'

dotenv.config()
const app = express()

app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 3500

app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello World from Node.js server" })
})

app.use('/api/auth', authRouter)

app.listen(PORT, () => {
    console.log(`Nodejs server is running at port: ${PORT}`)
})


