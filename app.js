const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const Sequelize = require('./util/database');


const User = require('./models/signup');
const Messages = require('./models/messeges');
const Groups = require('./models/group');
const userGroups = require('./models/usergroup');


const userRoutes = require('./routes/signup');
const messageRoutes = require('./routes/message');
const groupRoutes = require('./routes/groups')
const groupDetailsRoutes = require('./routes/group-details')

const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users',userRoutes);
app.use('/chat',messageRoutes);
app.use('/groups',groupRoutes);
app.use('/group-details',groupDetailsRoutes)


app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`frontend/${req.url}`))
})

User.hasMany(Messages);
Messages.belongsTo(User)

User.belongsToMany(Groups,{through:userGroups});
Groups.belongsToMany(User,{through:userGroups});
Groups.hasMany(userGroups);
userGroups.belongsTo(Groups);
User.hasMany(userGroups);
userGroups.belongsTo(User);

Groups.hasMany(Messages);
Messages.belongsTo(Groups);




Sequelize
//.sync({force:true})
.sync()
.then (result =>{
    app.listen(3000);
})
.catch(err =>{
    console.log(err);
})
