import jwt from "jsonwebtoken"

module.exports = function (req,res,next){
    const token = req.header('x-auth-token')
    if(!token){
        return res.status(401).json({message: "not token, authorization denied"})
    }
    try{
        if(!process.env.JWT_SECRET_KEY){
            console.error('not jwt secret present')
            return res.status(500).json({message:'server authentication configuration error'})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded.user
        next()

    }catch(err){
        res.status(401).json({message:'token is not valid'})
    }
}