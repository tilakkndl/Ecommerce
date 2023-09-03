const crypto = require("crypto")

const catchAsync = require("../utils/catchAsync")
const User = require("../models/userModel")
const AppError = require("../utils/AppError")
const sendToken =require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail")

exports.registerUser = catchAsync(async(req, res, next)=>{
    const {name, password, email} = req.body;

    const user = await User.create({
        name,
        password,
        // role,
        email,
        avatar:{
            public_id: "Sample public id",
            url: "sample url"
        }
    })

    sendToken(user, 201, res)
})


exports.loginUser = catchAsync(async(req, res, next)=>{
    const {email, password} = req.body;

    if(!email || !password){
return next(new AppError("Please enter email and password", 400))
    }

const user = await User.findOne({email}).select("+password")

if(!user){
    return next(new AppError("Invalid email or password", 401)) 
}

const isPasswordMatched = await user.comparePassword(password)


if(!isPasswordMatched){
    return next(new AppError("Invalid email and password", 401))
}

sendToken(user, 201, res)
})



exports.logout = catchAsync(async(req, res, next)=>{
    res.cookie("token", null, {
        expires: new Date(new Date()),
        httpOnly: true
    })

    res.status(200).json({
        status: true,
        message: "Successfully logged out of the system "
    })
})

exports.forgetPassword = catchAsync(async(req, res, next)=>{
    const user = await User.findOne({email: req.body.email})

    if(!user){
        return next(new AppError("User not found", 404))

    }

    //Get reset token
    const resetToken = user.getResetPasswordToken()

    await user.save({validateBeforeSave: false})

    const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/reset/${resetToken}`
    const message = `Your reset password token is :- \n\n ${resetPasswordURL} \n\n If you don't resquest this, just ignore it.`

    try{
await sendEmail({
    email: user.email,
    subject: "Ecommerce password Recovery",
    message,
})

res.status(200).json({
    success: true,
    message: `Email sent to ${user.email} successfully`
})

    }catch(err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false})

        return next(new AppError(err.message, 500))
    }
})


exports.resetPassword = catchAsync(async(req, res, next)=>{
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Reset password token is invalid or has been expired!",
    });
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirmation password does not match!",
    });
  }

  // Use hashed password and save it in the database later
//   const saltRounds = 10;
//   const salt = bcrypt.genSalt(saltRounds);
//   user.password = await bcrypt.hash(user.password, +salt);
user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // console.log(user);

  await user.save();

  sendToken(user, 200, res);
})


//Get a user details
exports.getUserDetails = catchAsync(async(req, res, next)=>{
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user,
    })
})


//Update  user password
exports.updatePassword = catchAsync(async(req, res, next)=>{
    const user = await User.findById(req.user.id).select("+password")


    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)


    if(!isPasswordMatched){
        return next(new AppError("Old Password is incorrect", 400))
    }

    if(req.body.password!=req.body.confirmPassword){
        return next(new AppError("Password doesn't match", 400))
    }

    user.password = req.body.password

    await user.save()

sendToken(user, 200, res)
})



//Update  user Details
exports.updateUserProfile = catchAsync(async(req, res, next)=>{
   
const newUserData = {
    email: req.body.email,
    name: req.body.name
}
    //we will add cloudinary later
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

//Get all users --ADMIN
exports.getAllUsers = catchAsync(async(req, res, next)=>{
    const users = await User.find()
    res.status(200).json({
        success: true,
        users
    })
})

//Get a user Detail --ADMIN
exports.getUserDetailByAdmin=catchAsync(async(req, res, next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new AppError(`The user with id ${req.params.id} is not found`, 404))
    }

    res.status(200).json({
        success: true,
        user
    })
})


//Update  user Details  --ADMIN
exports.updateUserRoleAdmin = catchAsync(async(req, res, next)=>{
   
    const newUserData = {
        email: req.body.email,
        name: req.body.name,
        role: req.body.role
    }
        //we will add cloudinary later
        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            userFindAndModify: false
        })
        if(!user){
            return next(new AppError(`User does not exist with id ${req.params.id}`, 400))
        }
    
        res.status(200).json({
            success: true
        })
    })
    


    //Delete user Details --ADMIN
exports.deleteUserProfileAdmin = catchAsync(async(req, res, next)=>{
   
const user = await User.findById(req.params.id)

        //we will remove cloudinary later

        if(!user){
            return next(new AppError(`User does not exist with id ${req.params.id}`, 400))
        };

        await User.findByIdAndDelete(req.params.id)        
    
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    })
    

    



    