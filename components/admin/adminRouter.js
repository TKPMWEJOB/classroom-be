const express = require('express');
const router = express.Router();
const adminController = require('./adminController');

router.get('/courses', adminController.courses);
router.get('/users', adminController.users);
module.exports = router;