const Users =require('../models/signup');
const bcrypt = require('bcrypt');
const { error } = require('console');
const jwt = require('jsonwebtoken');

function tokenGenerator (id){
    return jwt.sign({userId:id},process.env.TOKEN_SECRET)
}

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


const loginUser = async (req,res,next)=>{
    try{
        const {email,password}=req.body;

        const user = await Users.findOne({where:{email:email}});
        if(!user)
        {
            return res.status(404).json({err: "user not found"})
        }

        const result = await new Promise((resolve,reject)=>{
             bcrypt.compare(password,user.password, (err,result)=>{
                if(err)
                {
                    console.log(error);
                    reject(err);
                }
                else{
                    resolve(result);
                }
            })
        })
        if(result)
        {
            return res.status(201).json({message:"Login succesful",token : tokenGenerator(user.id)});
        }
        else{
            return res.status(401).json({message:"wrong password"})
        }

    }
    catch(err){
          console.log(err);
    }
}
module.exports={
    addUser,
    loginUser
}