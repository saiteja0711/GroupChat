const Users =require('../models/signup');
const Messages = require('../models/messeges');
const Groups = require('../models/group');
const userGroups = require('../models/usergroup');

const addGroup = async(req,res,next)=>{
    let groupname = req.body.groupname;

   try{ 
    let group = await Groups.create({
        groupname:groupname
    })

    let  usergroup = await userGroups.create({
        userId:req.user.id,
        groupId:group.id
    })
    res.status(200).json({sucess:true})
    }
   catch (err){
    console.log(err);
    res.status(500).json({sucess:false})
     }
}

const getUserGroups = async (req,res,next)=>{
    let userid = req.user.id;
try {
    const groups = await Groups.findAll({
        attributes:['id','groupname'],
        include: [
            {
                model: userGroups,
                where: { userId: userid } 
            }
        ]
    });
    res.status(200).json(groups);
}
catch (err){
    console.log(err);
    res.status(500).json({message:'Internal Server Error'})
}

    
    

}

module.exports ={
    addGroup,
    getUserGroups
}