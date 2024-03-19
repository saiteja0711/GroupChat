const express = require('express');
const router = express.Router();

const groupDetailsController = require('../controller/group-details');
const Userauthenticate = require('../middleware/auth');


router.get('/isadmin',Userauthenticate.authenticate,groupDetailsController.IsAdmin);
router.get('/users',groupDetailsController.getUsers);
router.put('/makeadmin',groupDetailsController.makeAdmin);
router.put('/removeuser',groupDetailsController.removeUser);
router.get('/allusers',groupDetailsController.getAllUsers)
router.post('/adduser',groupDetailsController.addUser)
module.exports = router;