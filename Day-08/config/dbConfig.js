import mongoose from "mongoose";

const { db_uri } = process.env;

const connection = async () => {
    try {
        await mongoose.connect(db_uri,)
        console.log("<=== DB-CONNECTED ===>");
    } catch (e) {
        console.log(e, "Error")
        console.error("<=== DB-CONNECTION-FAILED ===>");
    }
}

export default connection;