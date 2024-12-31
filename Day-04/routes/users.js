const mongoose = require('mongoose'); // import mongoose

mongoose.connect("mongodb://127.0.0.1:27017/Backend");  // connect port and create db

// schema
const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  age: Number
});

 // Export         // Model
module.exports = mongoose.model("allUsers", userSchema);
