import mongoose from "mongoose";
import 'dotenv/config'

const { MONGODB_URI } = process.env;

const connectDB = async () => {
    try {
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables.");
        }
        
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("===== DATABASE CONNECTED =====");
    } catch (err) {
        console.error(`===== DATABASE CONNECTION FAILED =====: ${err.message}`);
        process.exit(1);
    }
};

export default connectDB;
