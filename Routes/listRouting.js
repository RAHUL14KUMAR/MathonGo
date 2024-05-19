const express = require('express');
const { createList } = require('../Controllers/addListControllers');
const { sendMail, sendAllEmail } = require('../Controllers/sendMail');

const router = express.Router();

router.route('/')
.post(createList)

router.route('/sendMail')
.get(sendAllEmail)

module.exports = router;