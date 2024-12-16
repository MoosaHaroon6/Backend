const express = require('express'); // express js installed
let oneLineJoke = require('one-liner-joke');  // one-liner pkg 
let figlet = require("figlet"); // figlet(pkg) from npmjs

const port = 3000;
const app = express(); // as app

let joke = oneLineJoke.getRandomJoke().body;
console.log(joke);

let text = figlet("Hello World!!", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});
console.log(text);

app.use((req, res, next) => {
  console.log("Middleware function");
  next();
})

app.get('/', (req, res) => {
  res.send('First Program! In backend it is running succesfully');
})

app.get('/jokes', (req, res) => {
  res.send(`<h1>Random Jokes</h1><p>${joke}</p>`);
})

app.get('/text', (req, res) => {
  figlet.text(
    "Moosa",
    {
      font: "4Max",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 100,
      whitespaceBreak: true
    },
    function (err, data) {
      if (err) {
        res.send("Something went wrong...");
        console.dir(err);
        return;
      }
      res.send(`<pre>${data}</pre>`);
    })
})


app.listen(port, console.log("First Program! In backend"));