const express = require('express');
const router = express.Router();
const passport = require('passport');
const coursesController = require('./coursesController');
const gradeStructureController = require('../gradeStructure/gradeStructureController');

router.get('/', passport.authenticate('jwt', { session: false }), coursesController.index);

router.post('/', passport.authorize('jwt'), coursesController.create);

router.put('/invite-member', passport.authorize('jwt'), coursesController.inviteMember);

router.put('/invitation-accepted', passport.authorize('jwt'), coursesController.invitationHandle);

router.delete('/:id', passport.authorize('jwt'), coursesController.delete);

router.put('/:id', passport.authorize('jwt'), coursesController.update);

router.get('/:id', passport.authorize('jwt'), coursesController.findOne);

// course's member
router.get('/:id/people', passport.authorize('jwt'), coursesController.findAllPeople);

// course's grade structure
router.get('/:id/grade-structure', passport.authorize('jwt'), gradeStructureController.index);

router.post('/:id/grade-structure', passport.authorize('jwt'), gradeStructureController.create);

router.delete('/:id/grade-structure', passport.authorize('jwt'), gradeStructureController.delete);

router.put('/:id/grade-structure/update-all', passport.authorize('jwt'), gradeStructureController.updateAll);

router.put('/:id/grade-structure/update-one', passport.authorize('jwt'), gradeStructureController.updateOne);

module.exports = router;
