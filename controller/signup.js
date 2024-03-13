const Users =require('../models/signup');
const bcrypt = require('bcrypt');

const addUser = async(req,res,next)=>{
    try{
        const {name,email,phonenumber,password}=req.body;
        const saltRounds=10;
        const hashedPassword = await bcrypt.hash(password,saltRounds)
        try{
            await Users.create({name,email,phonenumber,password:hashedPassword})
            res.status(201).json({message:"Successful"})
        }
        catch (err){
            console.log(err);
            res.status(401).json({error:err})

        }
    }
    catch (err){
       res.status(500).json({error:err})
    }
}
module.exports={
    addUser
}