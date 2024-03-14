const Users =require('../models/signup');
const Messages = require('../models/messeges');
 
const addMessage = async(req,res,next)=>{
    const {message} = req.body;
    console.log(req.body)
    try{

    await Messages.create({
        message:message,
        userId:req.user.id
    })
    res.status(200).json({success:'true'})
   }
   catch(err){
    res.status(401).json({error:err})
    console.log(error)
   }
}

const users = async (req,res,next) =>{
    try{
        let users = await Users.findAll({
            attributes:['name']
        });

        res.status(200).json({users});
    }
    catch (err){
        confirm.log(err);
    }
}

const Message = async (req,res,next)=>{
    try{
        let response = await Messages.findAll({
            attributes:['message'],
            include:{model:Users,attributes:['name']}
        })
        res.status(201).json({response})
    }
    catch (err){
        res.status(500).json({success:'false'});
        console.log(err);
    }
}

module.exports ={
    addMessage,
    users,
    Message
}