import express from 'express';
import connectDB from './configs/dbConfig.js';
import crypto from 'crypto';
import multer from 'multer';
import path from 'path';

const app = express();
const { PORT } = process.env;
connectDB();

app.set("view engine", "ejs"); // set the view engine to ejs

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer middleware
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
        // console.log(file);
        crypto.randomBytes(10, (err, bytes) => {
            const fn = bytes.toString("hex") + path.extname(file.originalname);
            cb(null, fn);
        })
    }
});

const upload = multer({ storage: storage });

// Routes
app.get("/", function (req, res) {
    res.send("Hello World!");
});

app.get("/testUpload", function (req, res) {
    res.render("index");
})


app.post("/testUpload", upload.single("file"), function (req, res) {
    res.render("index");
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})