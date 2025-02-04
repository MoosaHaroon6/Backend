import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import 'dotenv/config'
import bcryptjs from 'bcrypt';
import connectDB from './config/dbConfig.js'
import User from "./models/user.js";
import jwt from 'jsonwebtoken'
// import path from "path";
// import { fileURLToPath } from 'url';


const app = express();
const PORT = process.env.PORT;
const secretKey = process.env.SECRET_TOKEN;
connectDB();

// const filename = fileURLToPath(import.meta.url);
// const publicPath = path.join(path.dirname(filename), '../public/');

// template engine
app.set("view engine", "ejs");

// middlewares
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());

// app.use(express.static(publicPath));


// routes
app.get("/", (req, res) => {
    res.render("createAccount");
});

app.post("/createAccount", (req, res) => {
    const { name, email, password } = req.body;
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(password, salt, async (err, hash) => {
            const testUser = await User.create({
                name,
                email,
                password: hash // hashed password will be saved in DB
            });

            let token = jwt.sign({ email }, secretKey);
            res.cookie("Token", token);

            res.status(201).json({
                message: "Account created successfully",
                user: testUser
            })
        })
    })
});

app.get("/logout", (req, res) => {
    res.cookie("Token", "");
    res.redirect("/");
});

app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).send({
            message: "User not found",
            success: false
        });
    }

    bcryptjs.compare(password, user.password, (err, result) => {

        if (err) {
            return res.status(500).send("Server error");
        }

        if (!result) {
            return res.status(401).send({
                message: "Invalid email or password",
                success: false
            });
        }

        let token = jwt.sign({ email }, secretKey);
        res.cookie("Token", token);
        res.status(201).send({
            message: "Login successful",
            user: user,
            success: true
        });
    });
})

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});


