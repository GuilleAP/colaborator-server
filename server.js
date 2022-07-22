const app = require("./app");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 5005;

const myServer = app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});


const { Server} = require("socket.io")
const socketioJwt = require("socketio-jwt")
const Message = require("./models/Message.model")


//cors
const io = new Server(myServer, {
  cors: {
    origin: process.env.ORIGIN || "http://localhost:3000"
  }
})

//toke auth
io.use(socketioJwt.authorize({
  secret: process.env.TOKEN_SECRET,
  handshake: true
}))

//initialize what socketio server listens
io.on("connection", (socket) =>{
  const user = socket.decoded_token
  console.log("User connecting: " + user.name)

socket.once("join_chat", (chatId) =>{
  socket.join(chatId) //creates a socket room with chatId and adds the user to it
  console.log(`user: ${user.name} entering room: ${chatId}`)
})

socket.on("send_message", async (messageObj)=>{
  const fullMessage = {...messageObj, sender: user}
  
  await Message.create(fullMessage)
  //Sends changes to all sockets users
  socket.to(fullMessage.chatId).emit("receive_message", fullMessage) //sends the message to all socket room users except the sendes
  socket.emit("receive_message", fullMessage) //sends the message to the sender
})

})
