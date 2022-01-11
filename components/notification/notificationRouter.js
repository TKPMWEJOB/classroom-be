const express = require('express');
const router = express.Router();
const passport = require('passport');
const notificationController = require('./notificationController');

router.get('/all', passport.authorize('jwt'), notificationController.index);

router.post('/send-one', passport.authorize('jwt'), notificationController.createOne);

//router.post('/notification/send-many', passport.authorize('jwt'), notificationController.createMany);

router.post('/update-viewed-status', passport.authorize('jwt'), notificationController.updateViewedStatus);

module.exports = router;
