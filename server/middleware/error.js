// const AppError = require("../utils/AppError")

const AppError = require("../utils/AppError")

module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal server errror"

    if(err.name === "CastError"){
        err = new AppError(`Resource not found ${err.path}`, 400)
    }

    res.status(err.statusCode).json({
        status: false,
        error: err,
        message: err.message
    })
}