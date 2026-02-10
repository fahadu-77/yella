import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/User.js"

export const register = async (req,res)=>{
    try{
    const {name,email,password} = req.body
    let user = await User.findOne({email})
    if(user){
        return res.status(400).json({message: 'User already exists'})
    }
    const hashedPassword = await bcrypt.hash(password,10)
    user = new User({
        name,
        email,
        password: hashedPassword,
    })
    await user.save()

    const payload = {
        user:{
            id:user.id,
            email:user.email,
        }
    }
    if(!process.env.JWT_SECRET_KEY){
        return res.status(500).json({message:"jwt secret key is not avaliable"})
    }
    jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:'1d'},(err,token)=>{
        if(err) throw err
        res.json({
            token,
            user:{
                id:user.id,
                name:user.name,
                role:user.role,
            }
        })
    })
    }catch (error) {
  console.error(error); // IMPORTANT
  res.status(500).json({ message: "server error" });
}
    
}

export const login = async (req,res)=>{
    try{
    const {email,password} = req.body
    let user = await User.findOne({email})
    if(!user){
        return res.status(400).json({msg: 'invalid credentials'})
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({msg:'invalid credentials'})
    }
    const payload ={
        user:{
            id:user.id,
            email:user.email,
        }
    }
    if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ msg: 'JWT secret not configured' });
        }

    jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    enrolledCourses: user.enrolledCourses || []
                }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

}