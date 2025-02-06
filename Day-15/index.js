import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import 'dotenv/config';
// local imports
import connectDB from './config/dbConfig.js';
import User from './models/user.js';
import Post from './models/post.js';


const app = express();
connectDB(); // db required


// middlewares
app.use(express.json());
app.use(logger('dev'));
app.use(cors());


// routes
app.get("/", (req, res) => {
    res.send("Hello, World!");
    console.log("Hello World")
})

app.get("/register", async (req, res) => {
    const user = await User.create({
        name: "Moosa",
        email: "moosa@gmail.com",
        posts: []
    })
    res.send(user);
})

app.get("/post/add", async (req, res) => {
    const post = await Post.create({
        data: "Hello Today im gonna show how to create a post",
        user: "67a50690168fa4311a4a4019"
    });

    let user = await User.findOne({
        _id: "67a50690168fa4311a4a4019"
    });

    user.posts.push(post._id);
    await user.save();

    res.send({ post, user });
});



app.listen("3000", () => {
    console.log("Server is running on port 3000");
})