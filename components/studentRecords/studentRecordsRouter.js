const express = require('express');
const router = express.Router();
const passport = require('passport');
const studentRecordController = require('./studentRecordsController');
const grantPermission = require('../auth/rolePermission').grantPermission;

router.get('/:id/grades', studentRecordController.index);
router.post('/:id/grades/upload/studentlist', passport.authorize("jwt"), grantPermission(["teacher", "owner"]), studentRecordController.uploadStudentList);

module.exports = router;