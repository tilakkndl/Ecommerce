const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/AppError")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

exports.isAuthenticatedUser = catchAsync(async(req, res, next)=>{
const {token} = req.cookies;
// console.log(token)
if(!token){
    return next(new AppError("Please log in to access resource", 401))
}

const decodedData = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findOne({_id: decodedData.id})
// console.log(req.user);
next()
})

exports.authorizeRoles = (...roles)=>{
    return(req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError(`Role: ${req.user.role} is not allowed to access the resource`, 403))
        }
        next()
    }
   
}