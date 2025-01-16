import express from "express"
import cors from "cors"
import logger from "morgan"
import "dotenv/config";
import User from "./models/UserSchema.js";
import bcrypt from 'bcrypt';
import connection from "./config/dbConfig.js";
import jwt from 'jsonwebtoken';

const app = express();
connection();

/* Middlewares */
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* Middlewares */

const { PORT, secret_token } = process.env;

app.get('/', (req, res) => {
    res.send("Hello world");
    console.log("Hello world")
})

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        const saved = await newUser.save();
        delete saved.password;
        console.log(saved, "User Saved");
    } catch (e) {
        console.error(e, "User Not created");
    }
})

app.post('/login', async (req, res) => {
    try {

        const user = await User.findOne({ email: req.body.email }); // user
        if (!user) {
            res.send({ message: "user not found" });
            return;
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password); // password
        if (!passwordMatch) {
            res.send({ message: "Invalid Password" });
            return;
        }

        const userObj = user.toObject();
        delete userObj.password;   // password removed for security 

        const token = jwt.sign(
            { id: user._id, email: user.email },
            secret_token,
            { expiresIn: "1hr" });

        // res.send({ token: token, ...user });
        // console.log("Token Got",token,{...user});

        res.status(200).json({ token, user: userObj });

    } catch (e) {
        console.log("Error", e);
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
})
