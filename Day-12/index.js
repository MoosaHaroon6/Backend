import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import User from './models/User.js'

const app = express();

// ejs
app.set("view engine", "ejs");


// middlewares
app.use(cors("*"));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { PORT } = process.env; // env imports

// routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/read", async (req, res) => {
    const users = await User.find({});
    res.render("read", { users });
});

app.post("/create", async (req, res) => {
    const { name, email, password, image } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        image
    });

    res.redirect("/read");
    console.log(user);
});

app.get("/delete/:id", async (req, res) => {
    const deleteUser = await User.findOneAndDelete({ _id: req.params.id });
    res.redirect("/read");
    console.log(deleteUser);
});

app.get("/edit/:id", async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    // console.log(user); 
    res.render("edit", { user });
});

app.post("/update/:id", async (req, res) => {
    const { name, email, image } = req.body;
    const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.id }, // filteration id
        { email, name, image }, // data to update
        { new: true } // return updated document
    );

    console.log(updatedUser);
    res.redirect("/read");
});

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});
