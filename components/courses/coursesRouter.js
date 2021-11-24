const express = require('express');
const router = express.Router();
const passport = require('passport');
const coursesController = require('./coursesController');

router.get('/', passport.authenticate('jwt', { session: false }), coursesController.index);

router.post('/', passport.authorize('jwt'), coursesController.create);

router.put('/invite-member', passport.authorize('jwt'), coursesController.inviteMember);

router.put('/invitation-accepted', passport.authorize('jwt'), coursesController.invitationHandle);

router.delete('/:id', passport.authorize('jwt'), coursesController.delete);

router.put('/:id', passport.authorize('jwt'), coursesController.update);

router.get('/:id', passport.authorize('jwt'), coursesController.findOne);

router.get('/:id/people', passport.authorize('jwt'), coursesController.findAllPeople);

module.exports = router;
