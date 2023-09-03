const express = require("express")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")

const product = require("./routes/productRoute")
const userRoute = require("./routes/userRoute")
const orderRoute = require("./routes/orderRoute")
const errorMiddleware = require('./middleware/error')

const app = express()

//built in middleware
app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())



//Checking middlware
app.use((req, res, next)=>{
    console.log("MIddlware")
    next()
})



//Routes
app.use("/api/v1", product)
app.use("/api/v1", userRoute)
app.use("/api/v1", orderRoute)




//Middleware for error handling 
app.use(errorMiddleware)



module.exports = app