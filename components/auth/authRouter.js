const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('./authController');

router.post('/signin', authController.signin);

router.post('/signup', authController.signup);

router.post('/check-info', authController.checkInfo);

router.get('/logout', authController.logout);

router.post('/google', authController.google);

router.post('/facebook', authController.facebook);

router.post('/email-resend', authController.emailResend);

router.get('/activate/:token', authController.activate);

router.post('/reset', authController.resetPasswordEmail);

router.get('/reset/:token', authController.checkResetPasswordToken);

router.post('/reset/:token', authController.resetPassword);

module.exports = router;
