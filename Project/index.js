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
    res.clearCookie("token", '');
    res.redirect("/login");
})

app.get("/dashboard", isLoggedIn, async (req, res) => {
    try {
        // find user and find posts
        let user = await User.findOne({ email: req.user.email }).populate("posts")
        res.render("dashboard", { user });
    } catch {
        console.log("Error");
        res.status(500).json({ msg: "Server Error", success: false });
    }
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
    try {
        // find posts and userid
        let post = await Post.findById(req.params.id).populate("user");
        const userId = req.user.userId;

        // check if user has liked the post
        if (!post) {
            return res.status(404).json({ msg: "Post not found", success: false });
        }
        // check if user has liked the post
        if (!userId) {
            return res.status(400).json({ msg: "Invalid user", success: false });
        }

        // check if post has already been liked by the user
        post.likes = post.likes.filter(like => like !== null);

        // update post likes array based on user liking or unliking the post
        if (!post.likes.includes(userId.toString())) {
            post.likes.push(userId);
        } else {
            post.likes = post.likes.filter(like => like.toString() !== userId.toString());
        }

        // save post
        await post.save();
        res.redirect("/dashboard");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ msg: "Server Error", success: false });
    }
});

app.get("/edit/:id", async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id }).populate("user");
        res.render("editPost", { post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error", success: false });
    }
});

app.get("/delete/:id", async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete({ _id: req.params.id });
        res.redirect("/dashboard");
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ msg: "Server Error", success: false });
    }
})

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
        // res.json({ msg: "User registered successfully.", success: true });
        res.redirect("/dashboard");
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
        // res.status(200).json({ msg: "User Logged In successfully", success: true });

        // redirect to dashboard
        res.redirect("/dashboard");
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ msg: "Server Error", success: false });
    }
})

app.post("/createPost", isLoggedIn, async (req, res) => {
    try {
        // Find user
        const user = await User.findOne({ email: req.user.email });
        const { content } = req.body;

        // Create new post and save it to the database
        const post = await Post.create({
            user: user._id,
            content,
        });

        // Add post to user's posts array
        user.posts.push(post._id);
        await user.save();

        console.log("New Post Created:", post);
        res.redirect("/dashboard");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ msg: "Server Error", success: false });
    }
});

app.post("/update/:id", isLoggedIn, async (req, res) => {
    try {
        // Find post and update its content
        const post = await Post.findOneAndUpdate(
            { _id: req.params.id },
            { content: req.body.content },
            { new: true }
        );

        res.redirect("/dashboard");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ msg: "Server Error", success: false });
    }
})

app.listen(PORT);
