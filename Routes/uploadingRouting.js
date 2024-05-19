const express = require('express');
const multer = require('multer');

const { uploading } = require('../Controllers/upoadCsvControllers');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.route('/')
.post(upload.single('file'),uploading)

module.exports = router;