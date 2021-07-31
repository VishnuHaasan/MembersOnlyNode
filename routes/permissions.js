const express = require('express');
const router = express.Router();
const PermissionsController = require('./../controllers/PermissionsController');
router.get('/admin', PermissionsController.admin_get);
router.post('/admin', PermissionsController.admin_post);

router.get('/member', PermissionsController.member_get);
router.post('/member', PermissionsController.member_post);

module.exports = router;
