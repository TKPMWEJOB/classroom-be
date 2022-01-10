const express = require('express');
const router = express.Router();
const passport = require('passport');
const notificationController = require('./notificationController');

router.get('/notification/all', passport.authorize('jwt'), notificationController.index);

router.post('/notification/send-one', passport.authorize('jwt'), coursesController.createOne);

router.post('/notification/send-many', passport.authorize('jwt'), coursesController.createMany);

router.put('/notification/update-status', passport.authorize('jwt'), coursesController.updateStatus);

module.exports = router;
