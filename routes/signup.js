const express = require('express');
const router = express.Router()

const signup = require('../controller/signup');

router.post('/signup' , signup.addUser);
router.post('/login' , signup.loginUser)


module.exports = router