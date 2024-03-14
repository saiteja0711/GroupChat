const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const Sequelize = require('./util/database');


const User = require('./models/signup');
const Messages = require('./models/messeges');


const userRoutes = require('./routes/signup');
const messageRoutes = require('./routes/message')

const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users',userRoutes);
app.use('/chat',messageRoutes);


app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`frontend/${req.url}`))
})

User.hasMany(Messages);
Messages.belongsTo(User)

Sequelize
//.sync({force:true})
.sync()
.then (result =>{
    app.listen(3000);
})
.catch(err =>{
    console.log(err);
})
