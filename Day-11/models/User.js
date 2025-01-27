import mongoose from "mongoose";
import connectDB from "../config/db_config.js";

connectDB();

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model("AllUsers", UserSchema);

export default User;