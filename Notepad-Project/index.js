import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// configurations
const app = express();
const port = 3000;

// directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// set up ejs templating engine
app.set('view engine', 'ejs');

// middleware setup
app.use(cors("*"));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

// All Files Data
app.get('/', (req, res) => {
    const filesPath = path.join(__dirname, 'testFiles'); // Use absolute path
    fs.readdir(filesPath, (err, files) => {
        if (err) throw err;
        // console.log(files);
        res.render("index", { files });
    });
});

// Add new file
app.post('/create', (req, res) => {
    const customFilePath = req.body.title.split(' ').join('')
    fs.writeFile(`./testFiles/${customFilePath}.blog`, req.body.description, (err) => {
        if (err) throw err;
        res.redirect("/");
    })
});

// View file description
app.get('/testFiles/:filename', (req, res) => {
    const filePath = `./testFiles/${req.params.filename}`
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) throw err;
        res.render('fileDes', { filename: req.params.filename, data: data });
    });
})

// View clicked file for edit 
app.get('/edit/:filename', (req, res) => {
    const filePath = path.join(__dirname, "testFiles", req.params.filename);
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) throw err;
        res.render("Edit", { filename: req.params.filename, filedata: data });
    })
});

// Edit/Update file
app.post('/edit', (req, res) => {
    const oldFilePath = path.join(__dirname, "testFiles", req.body.prev);
    const newFilePath = path.join(__dirname, "testFiles", `${req.body.new}.blog`);

    fs.rename(oldFilePath, newFilePath, (err) => {
        if (err) throw err;

        fs.writeFile(newFilePath, req.body.description, (err) => {
            if (err) throw err;
            res.redirect("/");
        })
    });
});

// Delete file
app.post('/delete', (req, res) => {
    const filePath = path.join(__dirname, "testFiles", req.body.filename);
    fs.unlink(filePath, (error) => {
        if (error) throw error;
        res.redirect("/");
        // console.log(`File ${req.body.filename} has been Deleted`);
    })
})


app.listen(port, () => {
    console.log(`Server is running on Port ${port}`);
});