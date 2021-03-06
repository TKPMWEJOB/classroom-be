const express = require('express');
const router = express.Router();
const passport = require('passport');
const studentRecordController = require('./studentRecordsController');
const grantPermission = require('../auth/rolePermission').grantPermission;

router.get('/:id/grades', passport.authorize("jwt"), studentRecordController.index);
router.post('/:id/grades/upload/studentlist', passport.authorize("jwt"), grantPermission(["teacher", "owner"]), studentRecordController.uploadStudentList);
router.post('/:id/grades/upload/full-grade', passport.authorize("jwt"), grantPermission(["teacher", "owner"]), studentRecordController.uploadFullGrade);
router.post('/:id/grades/update-one-row', passport.authorize("jwt"), grantPermission(["teacher", "owner"]), studentRecordController.updateOneRow);
router.post('/:id/grades/upload/publish-one-grade', passport.authorize("jwt"), grantPermission(["teacher", "owner"]), studentRecordController.publishOneGrade);
router.post('/:id/grades/upload/publish-one-row', passport.authorize("jwt"), grantPermission(["teacher", "owner"]), studentRecordController.publishOneRow);
router.post('/:id/grades/upload/publish-one-col', passport.authorize("jwt"), grantPermission(["teacher", "owner"]), studentRecordController.publishOneColumn);
router.post('/:id/grades/upload/publish-all', passport.authorize("jwt"), grantPermission(["teacher", "owner"]), studentRecordController.publishAllRecords);

// Grade review
router.get('/:id/grades/:gradeid/student', passport.authorize("jwt"), grantPermission(["student"]), studentRecordController.findOneRecord);
router.get('/:id/grades/:gradeid/all', passport.authorize("jwt"), grantPermission(["teacher", "owner"]), studentRecordController.findGradeRecord);
router.post('/:id/grades/:gradeid/request-review', passport.authorize("jwt"), grantPermission(["student"]), studentRecordController.requestReview);
router.post('/:id/grades/:gradeid/accept-review', passport.authorize("jwt"), grantPermission(["teacher", "owner"]), studentRecordController.acceptReview);
router.post('/:id/grades/:gradeid/reject-review', passport.authorize("jwt"), grantPermission(["teacher", "owner"]), studentRecordController.rejectReview);

//Comment
router.get('/:id/grades/:gradeid/comment/student', passport.authorize("jwt"), grantPermission(["student"]), studentRecordController.findStudentComment);
//router.get('/:id/grades/:gradeid/comment/teacher', passport.authorize("jwt"), grantPermission(["teacher", "owner"]), studentRecordController.findTeacherComment);
router.post('/:id/grades/:gradeid/comment/student-comment', passport.authorize("jwt"), grantPermission(["student"]), studentRecordController.studentComment);
router.post('/:id/grades/:gradeid/comment/teacher-comment', passport.authorize("jwt"), grantPermission(["teacher", "owner"]), studentRecordController.teacherComment);
module.exports = router;