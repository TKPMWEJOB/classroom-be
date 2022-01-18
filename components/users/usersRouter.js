const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('./usersController');

router.get('/', passport.authorize('jwt'), usersController.findOne);

router.get('/:id', passport.authorize('jwt'), usersController.findOneOtherUser);

router.get('/find-user/:id', usersController.findUserInCourse);

router.get('/find-user/:studentId', usersController.findUserWithStudentId);

router.get('/find-student/:studentId', usersController.findUserWithStudentId);

router.delete('/', passport.authorize('jwt'), usersController.delete);

router.put('/nameid', passport.authorize('jwt'), usersController.updateNameId); // update user's name and student id

router.put('/info', passport.authorize('jwt'), usersController.updateInfo); // update personal information

//router.get('/:id', usersController.findOne);

module.exports = router;
