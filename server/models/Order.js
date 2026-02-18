import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    customer:{type:mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    items:[{
        product:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
        quantity:{type:Number,required:true}
    }],
    totalAmount:{type:Number,required:true},
    address:{type:String, required:true},
    status:{
        type:String,
        enum:['placed','packing','ready','on-the-way','delivered'],
        default:'placed',
    },
    deliveryBoy:{type:mongoose.Schema.Types.ObjectId,ref:'User',default:null},
    otp:{type:String},
    paymentMehtod:{type:String,default:'COD'}
},{timestamps:true})

export const Order = mongoose.model('Order',orderSchema)