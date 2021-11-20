const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('./usersController');

router.get('/', passport.authenticate('jwt', { session: false }), usersController.index);

router.delete('/:id', usersController.delete);

router.put('/nameid/:id', usersController.updateNameId); // update user's name and student id

router.put('/info/:id', usersController.updateInfo); // update personal information

router.get('/:id', usersController.findOne);

module.exports = router;
