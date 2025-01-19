import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors("*"));
app.use(morgan("dev"));

const { PORT } = process.env;

const appServer = http.createServer(app);  // server created

const io = new Server(appServer, { // socket config
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const userSocketID = {};

io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on("registeruser", (userId) => {
        userSocketID[userId] = socket.id;
    })

    socket.on("new_chat", async (data) => {
        const { message, senderId, receiverId } = data;
        
        io.emit("new_chat", {
            message,
            senderId,
            receiverId
        });
    })

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    })
})





appServer.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});