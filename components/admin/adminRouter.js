const express = require('express');
const passport = require('passport');
const router = express.Router();
const adminController = require('./adminController');

router.get('/courses', passport.authorize('jwt'), adminController.courses);
router.get('/users', passport.authorize('jwt'), adminController.users);
module.exports = router;