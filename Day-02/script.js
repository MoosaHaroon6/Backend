const express = require('express');
const app = express();
const port = 3000;

app.use((req, res, next) => {  // middleware function
  console.log("middleware request");
  next();
}) 

app.get('/', (req, res) => {
  res.send("Hello world");
})

app.get('/profile/:username', (req, res) => {
  res.send(`Hey ${req.params.username}`);
})

app.listen(port, console.log("Program Running"));