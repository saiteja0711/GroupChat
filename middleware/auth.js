const jwt = require('jsonwebtoken');
const User =require('../models/signup');

const authenticate = async(req,res,next)=>{
    try{
        const token = req.header("Authorization");

        const decodedToken = jwt.verify(token,process.env.TOKEN_SECRET);

        const user = await User.findByPk(decodedToken.userId);

        if (!user) {
            throw new Error("User not found");
        }
        
        req.user = user;
        next();
    
    }
    catch (err){
        return res.status(401).json({ success: false });
        console.log(err);
    }
}
module.exports ={
    authenticate
}