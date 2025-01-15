import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false,
});

const User = mongoose.model("AllUser", UserSchema);

export default User;