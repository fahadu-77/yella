import {User} from '../models/User.js'

export const toggleDuty = async (req,res)=>{
    try{
        const user = await User.findById(req.user.id)
        user.isOnline = !user.isOnline
        user.isAvailable = user.isOnline
        await user.save()
        res.status(200).json({msg:`Duty status: ${user.isOnline? 'online':'offline'}`,isOnline:user.isOnline})
    }catch(err){
        res.status(500).json({msg:'toggle failed'})
    }
}