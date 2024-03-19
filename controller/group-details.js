const Users =require('../models/signup');
const Messages = require('../models/messeges');
const Groups = require('../models/group');
const userGroups = require('../models/usergroup');

const IsAdmin = async (req,res,next)=>{
    let userid = req.user.id;
    let groupid = req.query.groupId;
try {
    const isadmin = await userGroups.findOne({
        attributes:['isAdmin'],
        where: { userId: userid ,groupId:groupid } 
    });
    res.status(200).json(isadmin);
}
catch (err){
    console.log(err);
    res.status(500).json({message:'Internal Server Error'})
}

}

const getAllUsers = async(req,res,next) =>{
    try{
        let users = await Users.findAll();
        res.status(200).json({users})
    }
    catch (err){
        console.log(err);
    }

}

const getUsers = async (req,res,next) =>{
    let groupid = req.query.groupId
   try{
       let users = await Users.findAll({
           attributes:['id','name','email'],
           include: [
               {
                   model: userGroups,
                   where: { groupId: groupid },
                   attributes: ['isAdmin']
               }
           ]
       });

       res.status(200).json({users});
   }
   catch (err){
       console.log(err);
   }
}

const makeAdmin = async(req,res,next)=>{
    let userId = req.query.userId;
    let groupId = req.query.groupId;
    try{
        await userGroups.update(
            {isAdmin : true},
            {where:{userId:userId,groupId:groupId}}
        );
        res.status(200).json({success:true});
    }
    catch (err){
        res.status(500).json({err:err});
        console.log(err);
    }

}

const removeUser = async (req,res,next) =>{
    let userId = req.query.userId;
    let groupId = req.query.groupId;
    try{
        await userGroups.destroy({
            where: { userId: userId, groupId: groupId }
        });
        res.status(200).json({success:true});
    }
    catch (err){
        res.status(500).json({err:err});
        console.log(err);
    }
}

const addUser = async(req,res,next)=>{
    let {userId,groupId,isAdmin} = req.body;
    
    try{
        await userGroups.create({
         userId: userId,
         groupId: groupId,
         isAdmin:isAdmin
        });
        res.status(200).json({success:true});
    }
    catch (err){
        res.status(500).json({err:err});
        console.log(err);
    }
}

module.exports ={
    IsAdmin,
    getUsers,
    makeAdmin,
    removeUser,
    getAllUsers,
    addUser
}