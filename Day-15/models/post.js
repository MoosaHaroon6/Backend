import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    data: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "allUsers"
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const Post = mongoose.model("allPosts", postSchema);

export default Post;