const express = require('express');
const router = express.Router();
const passport = require('passport');
const coursesController = require('./coursesController');

router.get('/', passport.authenticate('jwt', { session: false }), coursesController.index);

router.post('/', coursesController.create);

router.delete('/:id', coursesController.delete);

router.put('/:id', coursesController.update);

router.get('/:id', coursesController.findOne);

module.exports = router;
