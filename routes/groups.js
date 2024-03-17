const express = require('express');
const router = express.Router();

const groupsController = require('../controller/groups');
const Userauthenticate = require('../middleware/auth');

router.post('/addgroup',Userauthenticate.authenticate,groupsController.addGroup)
router.get('/usergroups',Userauthenticate.authenticate,groupsController.getUserGroups)
module.exports = router;