import mongoose from "mongoose";
import connectDB from "../config/dbConfig.js";

connectDB();

const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: false
    }
})

const Task = mongoose.model("Task", taskSchema);
export default Task;