import User from "../models/User.js";

export const addUser = async (req ,res)=>{
    try{
        const {name, number} = req.body
        const user = await User.create({name,number})
        res.status(201).json({message: "user added to db",
        user,
     })
    }catch(error){
        console.error(error)
        res.status(500).json({message: "server error"})
    }

}

