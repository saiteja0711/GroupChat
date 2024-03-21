const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer')
const messageController = require('../controller/messages');
const Userauthenticate = require('../middleware/auth');
const upload = multer.upload;

router.get('/users',messageController.users);
router.post('/messages',Userauthenticate.authenticate,messageController.addMessage);
router.post('/files',Userauthenticate.authenticate,upload.single('fileInput'),messageController.uploadFiles)
router.get('/messages',messageController.Message)

module.exports = router;
