import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "allPosts"
        }
    ],
    profilePic: {
        type: String,
        default: "defaultPfp.png"
    }
});

const User = mongoose.model("allUsers", userSchema);

export default User;
