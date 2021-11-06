const express = require('express');
const router = express.Router();
const coursesController = require('./coursesController');

router.get('/', coursesController.index);

router.post('/', coursesController.create);

router.delete('/:id', coursesController.delete);

router.put('/:id', coursesController.update);

module.exports = router;
