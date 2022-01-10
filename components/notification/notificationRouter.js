const express = require('express');
const router = express.Router();
const passport = require('passport');
const notificationController = require('./notificationController');

router.get('/notification/all', passport.authorize('jwt'), notificationController.index);

router.post('/notification/send-one', passport.authorize('jwt'), notificationController.createOne);

//router.post('/notification/send-many', passport.authorize('jwt'), notificationController.createMany);

router.put('/notification/update-status', passport.authorize('jwt'), notificationController.updateStatus);

module.exports = router;
