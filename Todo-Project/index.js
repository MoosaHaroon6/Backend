import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import 'dotenv/config'
import Task from './models/task.js';
import moment from 'moment';

const app = express();

// set up template engine
app.set('view engine', 'ejs');

// middlewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded());

// Environment Variables
const { PORT } = process.env;


// routes
app.get("/", (req, res) => {
    res.render("addTask");
})

app.post("/addTask", async (req, res) => {
    const { task } = req.body;
    const newTask = new Task({ task });
    await newTask.save();
    console.log("Task has been added", newTask);
    res.redirect("/viewTask");
});

app.get("/viewTask", async (req, res) => {
    const tasks = await Task.find();
    tasks.forEach(task => {
        task.createdAtInFormat = moment().format('MMMM Do YYYY, h:mm:ss a')
    });

    res.render("viewTask", { tasks });
});

app.get("/delete/:id", async (req, res) => {
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id });
    console.log("Task has been deleted", deletedTask);
    res.redirect("/viewTask");
});

app.get("/editTask/:id", async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id });
    console.log("Task to be edited", task);
    res.render("editTask", { task });
});

app.post("/updateTask/:id", async (req, res) => {
    const { task } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { task } },
        { new: true }
    );
    console.log("Updated Task =>", updatedTask);
    res.redirect("/viewTask");
});

app.get("/resetAll", async (req, res) => {
    const resetAllTasks = await Task.deleteMany({});
    console.log("ALL Tasks Are cleared", resetAllTasks);
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});