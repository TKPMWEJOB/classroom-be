const express = require('express');
const router = express.Router();
const usersController = require('./usersController');

router.get('/', usersController.findOne);

router.delete('/', usersController.delete);

router.put('/nameid', usersController.updateNameId); // update user's name and student id

router.put('/info', usersController.updateInfo); // update personal information

//router.get('/:id', usersController.findOne);

module.exports = router;
