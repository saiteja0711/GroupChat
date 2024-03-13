const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('./util/database');
const cors = require('cors');


const userRoutes = require('./routes/signup');


const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/user',userRoutes);



app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`frontend/${req.url}`))
})

Sequelize
.sync({force:true})
//.sync()
.then (result =>{
    app.listen(3000);
})
.catch(err =>{
    console.log(err);
})
