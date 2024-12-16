let oneLineJoke = require('one-liner-joke');
let joke = oneLineJoke.getRandomJoke().body;

console.log("This is Joke :::::", joke);



let figlet = require("figlet");

// figlet.text(
//     "Moosa",
//     {
//         font: "4Max",
//         horizontalLayout: "default",
//         verticalLayout: "default",
//         width: 100,
//         whitespaceBreak: true
//     },
//     function (err, data) {
//         if (err) {
//             console.log("Something went wrong...");
//             console.dir(err);
//             return;
//         }
//         console.log(data);
//     })

const express = require('express');
const app = express();