const express = require("express")
const morgan = require("morgan")

const product = require("./routes/productRoute")
const errorMiddleware = require('./middleware/error')

const app = express()

//built in middleware
app.use(express.json())
app.use(morgan("dev"))



//Checking middlware
app.use((req, res, next)=>{
    console.log("MIddlware")
    next()
})



//Routes
app.use("/api/v1", product)




//Middleware for error handling 
app.use(errorMiddleware)



module.exports = app