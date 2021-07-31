var express = require('express');
var router = express.Router();
var UserController = require('./../controllers/UserController');

router.get('/create', UserController.create_get);
router.post('/create', UserController.create_post);
router.get('/:id', UserController.detail);

module.exports = router;
