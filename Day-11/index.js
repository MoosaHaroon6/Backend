import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import User from './models/User.js'

const app = express();
app.use(cors("*"));
app.use(morgan("dev"));

const { PORT } = process.env;

app.get("/", (req, res) => {
    res.send("Hello World!");
});


// see All Users
app.get("/allUsers", async (req, res) => {
    const readUsers = await User.find();
    res.send(readUsers);
})

// create User
app.get("/createUser", async (req, res) => {

    const creatUser = await User.create({
        name: "ali_",
        email: "ali@example.com",
        password: "moosa123"
    });

    res.send(creatUser);
});

// edit User
app.get("/updateUser", async (req, res) => {

    const updateUser = await User.findOneAndUpdate(
        { email: "moosa@example.com" },
        { email: "moosaUpdated@gmail.com" },
        { new: true }
    )

    res.send(updateUser);
});

// delete User
app.get("/deleteUser", async (req, res) => {
    const deleteUser = await User.findOneAndDelete({ name: "moosa_" });
    res.send(deleteUser);
})

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});