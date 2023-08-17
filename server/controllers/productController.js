const Product = require("../models/productModel")
const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")
const AppFeature = require("../utils/appFeature")

//create product -ADMIN
exports.createProduct = catchAsync(async(req, res)=>{

    const product = await Product.create(req.body)
    res.status(200).json({status: "Success", message: "Product created", product})
}
)

exports.getAllProducts = catchAsync(async(req, res)=>{

    const resultPerPage = 5;
    const productCount = await Product.countDocuments()

    const apiFeatue = new AppFeature(Product.find(), req.query).search().filter().pagination(resultPerPage)
    const products = await apiFeatue.query;
    res.status(200).json({message: "All the products", success: true, products })
})

//Update product  --ADMIN
exports.updateProduct = catchAsync(async(req, res)=>{
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
        product,
        productCount
    })
})


//Delete a product --ADMIN
exports.deleteProduct = catchAsync(async(req, res, next)=>{
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
})

//product detail
exports.getProductDetail = catchAsync(async(req, res, next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        console.log("Product  not found")
        return next(new AppError("Product is not found", 500))
        
    }
    res.status(200).json({
        success: true,
product
        
    })

    return next(err)
})