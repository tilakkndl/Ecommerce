class AppError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
        this.isOperational = true
        // this.message = message
    }
}

module.exports = AppError