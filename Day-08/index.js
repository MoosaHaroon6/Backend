import express from "express"
import cors from "cors"
import logger from "morgan"
import "dotenv/config";
import User from "./models/UserSchema.js";
import bcrypt from 'bcrypt';
import connection from "./config/dbConfig.js";
import jwt from 'jsonwebtoken';
import nodemailer, { createTransport } from 'nodemailer';

const app = express();
connection();

/* Middlewares */
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* Middlewares */

const { PORT, secret_token, senderEmail, senderPassword } = process.env;

app.get('/', (req, res) => {
    res.send("Hello world");
    console.log("Hello world")
})

// transporter (path)
const transporter = nodemailer.createTransport({
    // secure: true,
    service: 'Gmail',
    auth: {
        user: senderEmail,
        password: senderPassword
    }
})


function sendEmail(recipientEmail, token) {
    const mailOption = {
        from: senderEmail,
        to: recipientEmail,
        html: `
          <p>Please verify your email by clicking the link below:</p>
          <a href="http://frontend-domain.com/verify/${token}" target="_blank">
            Verify Email
          </a>
        `,
        subject: "Verification Email",
    };

    transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent successfully:", info.response);
        }
    });
}

// registration route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        const saved = await newUser.save();
        delete saved.password;
        console.log(saved, "User Saved");
        res.send("User Created Successfully");

        const verificationToken = jwt.sign({ ...saved }, secret_token, { expiresIn: "1h" })
        sendEmail(req.body.email, verificationToken);
        res.send("Saved User");
    } catch (e) {
        console.error(e, "User Not created");
    }
})

// Email-verification route
app.post('/verifyEmail', async (req, res) => {
    const { token } = req.headers;
    try {
        const verified = jwt.verify(token, secret_token);
        const update = await User.findByIdAndUpdate(verified._doc._id, { verifiedEmail: true });
        console.log(update, "Email Verified");
        res.send("Email Verified Successfully");
    } catch (e) {
        console.error("Verification Error:", e);
        res.status(400).send({ message: "Invalid or Expired Token" });
    }
});


// login route
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
            { expiresIn: "1h" });

        // res.send({ token: token, ...user });
        // console.log("Token Got",token,{...user});

        res.status(200).json({ token, user: userObj });

    } catch (e) {
        console.log("Error", e);
    }
})

// sendEmail
app.post("/sendEmail", (req, res) => {
    const { recepientEmail, subject } = req.body;
    const mailOption = {
        from: senderEmail,
        to: recepientEmail,
        html: "<h1 style='color:green'>Hello World</h1>",
        subject
    }
    transporter.sendMail(mailOption, (err, emailSent) => {
        if (err) return res.send(err);

        console.log(emailSent);
        res.send({ "message": "email sent successfully" });

    });

})


app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
})