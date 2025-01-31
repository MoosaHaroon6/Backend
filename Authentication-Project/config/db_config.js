import mongoose from "mongoose";

const { MONGODB_URI } = process.env;
const connectDB = () => {
    mongoose
        .connect(MONGODB_URI)
        .then(() => console.log("===== DATABASE CONNECTED ====="))
        .catch((err) => {
            console.error(`===== DATABASE CONNECTION FAILED =====: ${err}`)
            process.exit(1);
        });
}

export default connectDB;