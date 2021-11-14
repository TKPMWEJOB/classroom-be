const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('./authController');

router.post('/signin', passport.authenticate('local', {session: false}), authController.signin);

router.post('/signup', authController.signup);

module.exports = router;
