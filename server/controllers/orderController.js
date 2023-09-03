const Order = require("../models/orderModel")
const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")
const AppFeature = require("../utils/appFeature")
const Product = require("../models/productModel")

exports.newOrder = catchAsync(async(req, res, next)=>{
    const {shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body;
    const order = await Order.create({
        shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(201).json({
        success: true,
        order
    })
})


//get single order
exports.getSingleOrder = catchAsync(async(req, res, next)=>{
    const order = await Order.findById(req.params.id).populate("user", "name email")
    if(!order){
        return next(new AppError(`Order with id ${req.params.id} is not found`, 404))
    }
    res.status(200).json({
        success: true,
        order
    })
})


//get logged in user order
exports.myOrders = catchAsync(async(req, res, next)=>{
    const orders = await Order.find({user: req.user._id})

    res.status(200).json({
        success: true,
        orders
    })
})



//get all orders --ADMIN
exports.getAllOrders = catchAsync(async(req, res, next)=>{
    const orders = await Order.find()

    let totalAmount = 0
    orders.forEach((order)=>{
        totalAmount+=order.totalPrice
    })

    res.status(200).json({
        success: true,
        orders,
        totalAmount
    })
})


//Update  orders status --ADMIN
exports.updateOrder = catchAsync(async(req, res, next)=>{
    const order = await Order.findById(req.params.id)

    if(order.orderStatus==="delivered"){
        return next(new AppError("You have aleady delivered the order ", 400))
    }

    order.orderItems.forEach(async (order)=>{
        await updateStock(order.product, order.quantity)
    })

    order.orderStatus = req.body.status
    if(req.body.status==="delivered"){

        order.deliveredAt= Date.now()
    }


    await order.save({validateBeforeSave: false})
 
    res.status(200).json({
        success: true,
        order,
        
    })
})


async function updateStock(id, quantity){
    const product = await Product.findById(id)
    product.stock -= quantity
    await product.save({validateBeforeSave: false})
}




//delete order --ADMIN
exports.deleteOrder = catchAsync(async(req, res, next)=>{
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new AppError(`Order with id ${req.params.id} is not found`, 404))
    }

    await Order.findByIdAndDelete(req.params.id)     

    res.status(200).json({
        success: true,
        message: "deleted"
    })
})
