import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import bcryptjs from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
// local imports
import connectDB from './config/dbConfig.js';
import User from './models/user.js'
import Post from './models/post.js'
import 'dotenv/config';
import isLoggedIn from './middlewares/middlewares.js';


const app = express();
const { PORT, SECRET_TOKEN } = process.env;
connectDB(); // db required


// view engine setup
app.set("view engine", "ejs");

// middlewares
app.use(cors());
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());



// routes

// GET REQUESTS
app.get("/", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/logout", (req, res) => {
    res.cookie("token", '');
    res.redirect("/login");
})

app.get("/dashboard", isLoggedIn, (req, res) => {
    res.send("Dashboard");
});

// POST REQUESTS
app.post("/register", async (req, res) => {
    const { username, email, password, age } = req.body;
    try {
        // check if user exists
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists.", success: false });

        // hash password
        const passSalt = await bcryptjs.genSalt(10); // salt for password
        const hashedPass = await bcryptjs.hash(password, passSalt); // hashed password

        // create new user and save to db
        const newUser = await User.create({
            username, email,
            password: hashedPass, age
        })

        // generate token
        const token = jwt.sign({ email, userId: newUser._id }, SECRET_TOKEN);
        // set cookie
        res.cookie("token", token); // set token in cookie
        res.json({ msg: "User registered successfully.", success: true });

    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ msg: "Server Error", success: false });
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User not found", success: false });

        // Compare passwords
        const isMatched = await bcryptjs.compare(password, user.password);
        if (!isMatched) return res.status(400).json({ msg: "Incorrect password", success: false });

        // Generate token
        const token = jwt.sign({ email: user.email, userId: user._id }, SECRET_TOKEN);

        // Set token as a cookie
        res.cookie("token", token, { httpOnly: true });

        // Send response
        res.status(200).json({ msg: "User Logged In successfully", success: true });

        // redirect to dashboard
        res.redirect("/dashboard");
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ msg: "Server Error", success: false });
    }
})

app.listen(PORT);