var express = require('express');
var router = express.Router();

const userModel = require('./users'); // import users.js

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/create', async function (req, res) {
  const user = await userModel.create({
    firstname: "Moosa",
    lastname: "Haroon",
    age: 19,
  });
  res.send(user);
});

module.exports = router;
