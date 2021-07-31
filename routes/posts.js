var express = require('express');
var router = express.Router();
var PostController = require('./../controllers/PostController');

router.get('/', PostController.list);
router.get('/post/create', PostController.create_get);
router.post('/post/create', PostController.create_post);
router.get('/post/delete/:id', PostController.delete_get);
router.post('/post/delete/:id', PostController.delete_post);

module.exports = router;
