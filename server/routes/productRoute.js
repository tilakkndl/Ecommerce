const express = require("express")
const {getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetail, createProductReview, getProductReviews, deleteReview} = require("../controllers/productController")
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth")


const router = express.Router()

router.get("/products", getAllProducts)
router.post("/admin/products",isAuthenticatedUser,authorizeRoles("admin"), createProduct)
router.put("/admin/products/:id",isAuthenticatedUser,authorizeRoles("admin"), updateProduct)
router.delete("/admin/products/:id",isAuthenticatedUser,authorizeRoles("admin"), deleteProduct)
router.get("/products/:id", getProductDetail)

router.route("/review").put(isAuthenticatedUser, createProductReview)

router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview)


module.exports = router 