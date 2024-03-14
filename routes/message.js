const express = require('express');
const router = express.Router();

const messageController = require('../controller/messages');
const Userauthenticate = require('../middleware/auth');


router.get('/users',messageController.users);
router.post('/messages',Userauthenticate.authenticate,messageController.addMessage);
router.get('/messages',messageController.Message)

module.exports = router;
