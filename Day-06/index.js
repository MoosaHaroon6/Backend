import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config'
import mongoose from 'mongoose';
import User from './models/UserSchema.js';

const app = express();
const { PORT, MONGODB_URI } = process.env;

console.log("code running", MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

mongoose.
    connect(MONGODB_URI)
    .then(() => {
        console.log("Database connected");
    })
    .catch(() => {
        console.error("<--- Database-Connection-Failed --->");
        // process.exit(1); 
    })

app.use((err, req, res, next) => {
    console.error("Error occurred:", err);
    res.status(500).send("An internal error occurred.");
});

app.post("/signUp", async (req, res) => {
    const { email, password, username } = req.body;
    const newUser = new User({ email, password, username });
    try {
        const saved = await newUser.save();
        console.log(saved);
        res.send("User Created Successfully", saved);
    } catch (e) {
        console.error(e);
    }
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
