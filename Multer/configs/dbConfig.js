import mongoose from "mongoose";
import 'dotenv/config'

const { MONGODB_URI } = process.env;

const connectDB = async () => {
    const notFound = !MONGODB_URI;
    try {
        if (notFound) {
            console.warn(`-- Error: Вы допускаете ошибки в конфигурациях кода,
                ваша база данных не подключается. Пишите более чистый код.`);
            return process.exit(1);
        }

        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, });
        console.log("===== DATABASE CONNECTED =====");

    } catch (err) {
        console.error(`===== DATABASE CONNECTION FAILED =====: ${err.message}`);
        process.exit(1);
    }
};

export default connectDB;
