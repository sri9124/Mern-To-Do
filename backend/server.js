import express from 'express'
import dotenv from 'dotenv'
import todoRoutes from '../backend/routes/todo.route.js'
import { connectDB } from './config/db.js'
import cors from 'cors' 

dotenv.config()

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())
app.use('/api/todos', todoRoutes)

app.listen(PORT, () => {
    connectDB()
    console.log(`\nSERVER IS RUNNING ON ${PORT}`)
})