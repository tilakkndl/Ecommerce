
const mongoose = require("mongoose")



const connectDatabase = ()=>{

    const DBUrl = process.env.DB_URL.replace("<password>", process.env.DB_PASSWORD)

    mongoose.connect(DBUrl, {
        useNewURLParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true
    }).then((data)=>{
        console.log(`Database connected at server ${data.connection.host}`)
    })
    .catch((err)=>{
        console.log(err)
    })
}


module.exports = connectDatabase