const express = require("express")
const {registerUser, loginUser, logout, forgetPassword, resetPassword, getUserDetails, updatePassword, updateUserProfile, getAllUsers, getUserDetailByAdmin, updateUserRoleAdmin, deleteUserProfileAdmin } = require("../controllers/userController")

const {isAuthenticatedUser, authorizeRoles}  = require("../middleware/auth")

const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logout)
router.route("/forgotPassword").post(forgetPassword)
router.route("/resetPassword/:token").put(resetPassword)
router.route("/user").get(isAuthenticatedUser, getUserDetails)
router.route("/updatePassword").put(isAuthenticatedUser, updatePassword)
router.route("/updateUserProfile").put(isAuthenticatedUser, updateUserProfile)

router.route("/admin/user").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers)
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetailByAdmin).put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRoleAdmin).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUserProfileAdmin)

module.exports = router;