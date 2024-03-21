const Users =require('../models/signup');
const Messages = require('../models/messeges');
const userGroups = require('../models/usergroup');
const { Op } = require('sequelize');
const S3services = require('../services/S3services')
 
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
     let lastUserGroupId = req.query.offset
    try{
        let users = await Users.findAll({
            attributes:['id','name','email'],
            include: [
                {
                    model: userGroups,
                    where: { groupId: groupid, id: { [Op.gt]: lastUserGroupId} },
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
            attributes:['message','id','filetype'],
            include:{model:Users,attributes:['name']},
            where: {
                groupId: groupId,
                id: {
                    [Op.gt]: id
                }
            }
        })
        //console.log(response);
        res.status(201).json({response})
    }
    catch (err){
        res.status(500).json({success:'false'});
        console.log(err);
    }
}
const uploadFiles = async (req,res,next) =>{
 try{
    let groupId = Number(req.query.groupId);
    let userId = req.user.id;
    
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const file = req.file.buffer;
    const mimeType = req.file.mimetype;
    let value ;
    if (mimeType.startsWith('image/')) {
        value = 'image';
    }
    else if (mimeType.startsWith('video/')) {
        value = 'video';
    }
    else if (mimeType.startsWith('audio/')) {
          value = 'audio';
    }
    else {
        value = 'file not supported'
    }

    const filename = `${userId}/${new Date()}${file.name}`;
    const fileUrl = await S3services.uploadToS3(file,filename);
    await Messages.create({message:fileUrl,filetype:value,userId:userId,groupId:groupId});
    res.status(200).json({success:true,message:'File Sent'})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:error})
    }


}

module.exports ={
    addMessage,
    users,
    Message,
    uploadFiles
}