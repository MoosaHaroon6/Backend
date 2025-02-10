import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    content: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "allUsers"
    },
    date: {
        type: Date,
        default: Date.now()
    },
    likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "allUsers",
        default: []
    }
});

const Post = mongoose.model("allPosts", postSchema);

export default Post;