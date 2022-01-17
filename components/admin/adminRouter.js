const express = require('express');
const router = express.Router();
const adminController = require('./adminController');

router.get('/courses', adminController.courses);
router.get('/users', adminController.users);
router.post('/users/update-student-id', adminController.updateStudentID);
module.exports = router;