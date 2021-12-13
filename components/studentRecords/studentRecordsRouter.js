const express = require('express');
const router = express.Router();
const passport = require('passport');
const studentRecordController = require('./studentRecordsController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/:id/grades', studentRecordController.index);
router.post('/:id/grades/upload/studentlist', upload.single('file'), studentRecordController.uploadStudentList);

module.exports = router;