import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'


export const isAuth = async (req,res,next) =>{
    try{
        const token =   req.headers.token;
        if(!token){
            return res.status(403).json({
                message:"Please Login to access",
            });
        }
        //Decode to jwt token
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decodedToken._id);
        next();
    }catch(error){
        return res.status(403).json({
            message : "Please Login to access", 
        });
    }
};