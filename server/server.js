const app = require("./app")
const dotenv = require("dotenv")

const connectDatabase = require("./config/database")

//error handling
process.on("uncaughtException", err=>{
    console.log(`Unhandles Exception error: ${err.message}`)
    console.log("Server sutting down due to unchaught exception")

    server.close(()=>{
        process.exit()
    })
})

//getting env var throught dotenv
dotenv.config({path: "server/config/config.env"})

//connecting database
connectDatabase()


const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is running at https://localhost:${process.env.PORT }`)
})


//handling unhandled asynchronous error
process.on("unhandledRejection", err=>{
    console.log(`Error: ${err.message}`)
    conosle.log("Server shutting down due to unhandled rejection")

        process.exit()
})


