const express = require('express');
const router = express.Router();
const passport = require('passport');
const studentRecordController = require('./studentRecordsController');
const grantPermission = require('../auth/rolePermission').grantPermission;

router.get('/:id/grades', passport.authorize("jwt"), studentRecordController.index);
router.post('/:id/grades/upload/studentlist', passport.authorize("jwt"), grantPermission(["teacher", "owner"]), studentRecordController.uploadStudentList);
router.post('/:id/grades/upload/full-grade', passport.authorize("jwt"), grantPermission(["teacher", "owner"]), studentRecordController.uploadFullGrade);
router.post('/:id/grades/update-one-row', passport.authorize("jwt"), grantPermission(["teacher", "owner"]), studentRecordController.updateOneRow);
router.post('/:id/grades/upload/publish-grade', passport.authorize("jwt"), grantPermission(["teacher", "owner"]), studentRecordController.publishGrade);

module.exports = router;