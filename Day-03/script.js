const express = require('express');
const app = express();
const port = 3000;

app.set("view engine", "ejs"); // ejs configuration

app.use(express.static('./public'))

app.get('/', (req, res) => {
  res.render("index");
})

app.get('/profile/:username', (req, res) => {
  res.send(`Hey ${req.params.username}`);  // dynamic routing
})

app.get('/error', (req, res) => {
  throw Error ("Something went wrong");
})

app.use(function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.render('error', { error: err })
})

app.listen(port, console.log("Program Running"));