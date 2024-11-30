const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const userRouter = require('./Router/userRouter')
const loanRouter = require('./Router/LoanRouter')

const app = express()
dotenv.config()
connectDB()


app.use(cors())
app.use(express.json())
app.use('/api',userRouter)
app.use('/api',loanRouter)





module.exports = app