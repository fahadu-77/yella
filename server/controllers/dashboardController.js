import {Order} from '../models/Order.js'

export const getStaffDashboard = async (req,res) =>{
    try{
        const orders = await Order.find({
            status:{$in:['placed','packing','ready']}
        }).populate('customer','name phone')
        res.status(200).json(orders)
    }catch(err){
        res.status(500).json({msg:'error fetching dashboard'})
    }
}

export const getMyTask = async (req,res)=>{
    try{
        const order = await Order.findOne({
            deliveryBoy:req.user.id,
            status: 'on-the-way'
        }).populate('customer','name phone address')
        if(!order) return res.status(200).json({msg:'No active task'})
        res.status(200).json(order)
    }catch(err){
        res.status(500).json({msg:'error fetching task'})
    }
}