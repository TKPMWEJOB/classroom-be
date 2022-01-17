const express = require('express');
const passport = require('passport');
const router = express.Router();
const adminController = require('./adminController');

router.get('/courses', passport.authorize('jwt'), adminController.courses);

router.get('/users', passport.authorize('jwt'), adminController.users);

router.put('/users', passport.authorize('jwt'), adminController.usersUpdate);

router.get('/admin-account', passport.authorize('jwt'), adminController.admins);

router.post('/admin-account', passport.authorize('jwt'), adminController.adminsCreate);

router.put('/admin-account', passport.authorize('jwt'), adminController.usersUpdate);

module.exports = router;