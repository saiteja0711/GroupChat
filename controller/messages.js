const Users =require('../models/signup');
const Messages = require('../models/messeges');
const userGroups = require('../models/usergroup');
const { Op } = require('sequelize');

 
const addMessage = async(req,res,next)=>{
    const {message,groupId} = req.body;
    console.log(req.body)
    try{

    await Messages.create({
        message:message,
        userId:req.user.id,
        groupId:groupId
    })
    res.status(200).json({success:'true'})
   }
   catch(err){
    res.status(401).json({error:err})
    console.log(error)
   }
}

const users = async (req,res,next) =>{
     let groupid = req.query.groupId
     let offset = req.query.offset
    try{
        let users = await Users.findAll({
            attributes:['id','name','email'],
            include: [
                {
                    model: userGroups,
                    where: { groupId: groupid, id: { [Op.gt]: offset} },
                    attributes: ['id','isAdmin']
                }
            ],
            
        });

        res.status(200).json({users});
    }
    catch (err){
        console.log(err);
    }
}

const Message = async (req,res,next)=>{
     let id = Number(req.query.Lstid)
     let groupid = Number(req.query.groupId)
     console.log("id>>>>>>>>>>>>>>",id)
    
    try{
        let response = await Messages.findAll({
            attributes:['message','id'],
            include:{model:Users,attributes:['name']},
            where:{groupId:groupid},
            offset:id
        })
        //console.log(response);
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