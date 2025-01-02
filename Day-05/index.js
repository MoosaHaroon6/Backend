import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
console.log("CORS middleware initialized.");

// Morgan middleware for logging
morgan.format('myFormat', ':method :url :status :res[content-length] - :response-time ms');
app.use(morgan('myFormat'));
console.log('Morgan middleware initialized with "myFormat".');

// Enable JSON body parsing
app.use(express.json());

// Custom middleware 
app.use((req, res, next) => {
    console.log('Inside middleware');
    const ranNum = Math.ceil(Math.random() * 100);
    if (ranNum % 2 === 0) {
        res.send(`This is an even number: ${ranNum}`);
        // next();
    } else {
        console.log("Odd number, continuing to next handler...");
        next();
    }
});

// Define file paths
const htmlPath = path.resolve("public", "index.html");
const folderPath = path.resolve("public");


// Root route
app.get('/', (req, res) => {
    console.log("Req Received", req.url);
    res.send("Root route reached");
});


// Read file route
app.get("/readFile", (req, res) => {
    fs.readFile(htmlPath, (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Error reading file.");
        } else {
            res.send(data);
        }
    });
});


app.post("/writeFile", (req, res) => {
    const { fileName, fileContent } = req.body;

    if (!fileName || !fileContent) {
        return res.status(400).json({ error: "fileName and fileContent are required." });
    }

    const filePath = path.resolve(folderPath, fileName);

    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).json({ error: "Error writing file." });
        }
        res.json({ message: "File created successfully." });
    });
});


app.use((err, req, res, next) => {
    console.error("Error occurred:", err);
    res.status(500).send("An internal error occurred.");
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
