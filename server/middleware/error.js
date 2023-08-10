const ErrorHanlder = require("../utils/errorhandler")

module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal server errror"

    console.log("Here")
    res.status(err.statusCode).json({
        status: false,
        error: err
    })
}