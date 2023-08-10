const express = require("express")
const {getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetail} = require("../controllers/productController")


const router = express.Router()

router.get("/products", getAllProducts)
router.post("/products", createProduct)
router.put("/products/:id", updateProduct)
router.delete("/products/:id", deleteProduct)
router.get("/products/:id", getProductDetail)

module.exports = router