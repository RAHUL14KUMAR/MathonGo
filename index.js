require('dotenv').config();
const connect =require('./Database/db');
const express = require('express');
const uploadingRouting = require('./Routes/uploadingRouting');
const {sendMail} = require('./Controllers/sendMail');
const listRouting = require('./Routes/listRouting');

const app = express();
app.use(express.json());

app.use('/upload-csv', uploadingRouting);
app.use('/setList',listRouting);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
connect;