const socket = io('http://localhost:3000');

// socket.emit("registeruser", { userId: "UID" });

let msgBox = document.querySelector("#messages");
let msgInput = document.querySelector("#msg-box");


// message function
function sendMessage() {
    const newMessage = msgInput.value;
    console.log(newMessage);

    socket.emit("new_chat", {
        message: newMessage,
        senderId: socket.userId,
        receiverId: "socket.userId"
    });

    socket.on("new_chat", (newMessage) => {
        console.log("New Message Recevied", newMessage);
        msgBox.innerHTML += `<p>${newMessage.message}</p>`
    })
}


// let email = document.getElementById('email-inp');
// let password = document.getElementById('password-inp');

// // registration function
// function register() {

// }