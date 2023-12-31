const Product = require("../models/productModel")
const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")
const AppFeature = require("../utils/appFeature")


//create product -ADMIN
exports.createProduct = catchAsync(async(req, res)=>{
    req.body.user = req.user.id;

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
        // productCount
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

    // return next(err)
})


exports.createProductReview = catchAsync(async(req, res, next)=>{
    const {rating, comment, productId} = req.body;
    const review = {
        user:   req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId)

const isReviewed = product.reviews.find(rev=>rev.user.toString()===req.user._id.toString());

    if(isReviewed){
product.reviews.forEach((rev)=>{
    if(rev.user.toString()===req.user._id.toString()){
        rev.rating = rating
        rev.comment = comment
    }
})
    }else{
        product.reviews.push(review)
        product.reviewNumber = product.reviews.length
    }

    let avg = 0;
     product.reviews.forEach(rev=>{
        avg+=rev.rating
    })
    product.ratings = avg/product.reviews.length

    await product.save({validateBeforeSave: false})
    res.status(200).json({
        success: true
    })
})



//Get all the reviews of a product
exports.getProductReviews = catchAsync(async(req, res, next)=>{
    const product = await Product.findById(req.query.productId)
    if(!product){
        next(new AppError(`Product not found with id ${req.query.productId}`, 404))
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})


//Delete review
exports.deleteReview = catchAsync(async(req, res, next)=>{
    const product = await Product.findById(req.query.productId)
    if(!product){
        next(new AppError(`Product not found with id ${req.query.productId}`, 404))
    }

    const reviews = product.reviews.filter(rev=>rev._id.toString()!=req.query.id.toString())
console.log(reviews)
    let avg = 0;
     reviews.forEach(rev=>{
        avg+=rev.rating
    })
    const ratings = avg/product.reviews.length

    const reviewNumber = reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        reviewNumber
    },{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "Review successfully deleted"
    })
})