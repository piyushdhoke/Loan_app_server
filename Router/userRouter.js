const express = require('express')
const router = express.Router()
const {userRegister,userLogin} = require('../Controller/userController')
const auth = require('../middleware/authconfig')


router.post('/login',userLogin)
router.post('/register', userRegister)

module.exports = router

