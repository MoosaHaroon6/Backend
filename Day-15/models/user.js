import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'post'
    }
});

const User = mongoose.model("allUsers", userSchema);

export default User;