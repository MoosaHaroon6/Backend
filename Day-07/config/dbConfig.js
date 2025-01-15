import mongoose from "mongoose";

const { db_uri } = process.env;

export const connection = mongoose
    .connect(db_uri)
    .then(() => { console.log("<=== DB-CONNECTED ===>"); })
    .catch(() => {
        console.error("<=== DB-CONNECTION-FAILED ===>");
    });

