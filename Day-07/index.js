import express from "express"
import cors from "cors"
import logger from "morgan"
import "dotenv/config";
import User from "./models/UserSchema.js";
import { connection } from "./config/dbConfig.js";

const port = 3000;
const app = express();

/* Middlewares */
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* Middlewares */

app.get('/', (req, res) => {
    res.send("Hello world");
    console.log("Hello world")
})

app.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    const newUser = new User({ ...req.body });
    try {
        const saved = await newUser.save();
        console.log(saved, "User Saved");
    } catch (e) {
        console.error(e, "User Not created");
    }
})

app.listen(port, () => {
    console.log(`Server is running on Port ${port}`);
})