//user.route.js
const express = require ('express');
const { createAUser, getUsers } = require('./user.controller');
const router = express.Router();

//create user endpoint
//post a user
router.post('/', createAUser)
// get all users
router.get('/users', getUsers)

module.exports = router;