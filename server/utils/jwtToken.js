//creating token and saving in a cookie
const sendToken = (user, statusCode, res)=>{
    const token = user.getJWTToken()

    //options for cookies
    const options = {
        expires: new Date(
            Date.now()+process.env.COOKIE_EXPIRES_IN * 24* 60* 60 * 1000
        ),
        httpOnly: true
    }

    res.status(statusCode).cookie("token", token, options).json({
        status: true,
        token,
        user
    })
}

module.exports = sendToken