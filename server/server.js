const app = require("./app")
const dotenv = require("dotenv")

const connectDatabase = require("./config/database")

//getting env var throught dotenv
dotenv.config({path: "server/config/config.env"})

//connecting database
connectDatabase()


app.listen(process.env.PORT, ()=>{
    console.log(`Server is running at https://localhost:${process.env.PORT }`)
})