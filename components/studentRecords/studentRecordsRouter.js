const express = require('express');
const router = express.Router();
const passport = require('passport');
const studentRecordController = require('./studentRecordsController');

router.get('/:id/grades', studentRecordController.index);

module.exports = router;