const express = require('express');
const app = express();
const port = 3000;

app.set("view engine","ejs"); // ejs configuration

app.use((req, res, next) => {  // middleware function
  console.log("middleware request");
  next();
}) 

app.get('/', (req, res) => {
  res.render("index");
})

app.get('/profile/:username', (req, res) => {
  res.send(`Hey ${req.params.username}`);  // dynamic routing
})

app.listen(port, console.log("Program Running"));