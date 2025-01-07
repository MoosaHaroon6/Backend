import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must contain at least 6 characters"]
    },
    username: {
        type: String,
        required: true,
        trim: true, // it will remove unnecessary spaces
        minlength: [5, "Username must contain at least 5 characters"]
    },
},
    {
        timestamps: true // it will automatically detect the time when the document is created and updated
    });

const User = mongoose.model("AllUsers", UserSchema);

export default User;