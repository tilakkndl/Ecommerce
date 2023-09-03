// const AppError = require("../utils/AppError")

const AppError = require("../utils/AppError")

module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal server errror"

    //wrong mongodb id error
    if(err.name === "CastError"){
        err = new AppError(`Resource not found ${err.path}`, 400)
    }

    //Dublicate key error
    if(err.code===11000){
        const message = `Dublicate ${Object.keys(err.keyValue)} Entered`
        err = new AppError(message, 400)
    }

    //Wrong JWT error
    if(err.name === "JsonWebTokenError"){
        const message = "Json web token is invalid, try again!"
        err = new AppError(message, 400)
    }

      // JWT Expire error
      if(err.name === "TokenExpiredError"){
        const message = "Json web token is Expired, try again!"
        err = new AppError(message, 400)
    }


    res.status(err.statusCode).json({
        status: false,
        error: err,
        message: err.message
    })
}