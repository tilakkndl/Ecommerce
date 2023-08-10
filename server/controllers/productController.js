const Product = require("../models/productModel")
const AppError = require("../utils/errorhandler")

//create product -ADMIN
exports.createProduct = async(req, res)=>{

    const product = await Product.create(req.body)
    res.status(200).json({status: "Success", message: "Product created", product})
}


exports.getAllProducts = async(req, res)=>{
    const products = await Product.find()
    res.status(200).json({message: "All the products", success: true, products })
}

//Update product  --ADMIN
exports.updateProduct = async(req, res)=>{
let product = await Product.findById(req.params.id)

if(!product){
    return res.status(500).json({
        status: false,
        message: "product not found"
    })
}
     product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true, useFindAndModify: false})
    res.status(200).json({
        success: true,
        product
    })
}


//Delete a product --ADMIN
exports.deleteProduct = async(req, res, next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        return res.status(500).json({
            status: false,
            message: "product not found"
        })
    }

    await Product.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: "Successfully deleted",
        
    })
}
// const errorMiddleware = (error, req, res, next) => {
//     if (error instanceof HttpException) {
//         return res.status(error.status).send({ error: true, message: error.message });
//     }

//     console.error(error.stack);
//     return res.status(500).send({ error: true, message: 'Something broke!' });
// };

// module.exports = errorMiddleware;


//product detail
exports.getProductDetail = async(req, res, next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        console.log("Product  not found")
        console.log(new AppError("proudcct is not found", 500))
        return next(new AppError("Product is not found", 500))
        const err = {}
        err.message = "Product is not found"
        err.statusCode = 400
        return next(err)
        return res.status(500).json({
            status: false,
            message: "Product not found",
        })
    }
    res.status(200).json({
        success: true,
product
        
    })
}