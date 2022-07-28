const app = require("./app");
const Project = require("./models/Project.model");
const Card = require("./models/Card.model");

// const Project = require("../../models/Project.model");
// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 5005;

const myServer = app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});

const { Server } = require("socket.io");
const socketioJwt = require("socketio-jwt");
const Message = require("./models/Message.model");

//cors
const io = new Server(myServer, {

  cors: {
    // origin: process.env.ORIGIN || "http://localhost:3000",
    origin: "*",

  },
});

//toke auth
io.use(
  socketioJwt.authorize({
    secret: process.env.TOKEN_SECRET,
    handshake: true,
  })
);

//initialize what socketio server listens
io.on("connection", (socket) => {
  const user = socket.decoded_token;
  console.log("User connecting: " + user.name);

  //Projects controller
  socket.on("render_projects", () => {
    io.emit("receive_render_projects")
    io.emit("receive_render_activity");
  });

  //Tasks controllers
  socket.on("render_tasks", () => {
    io.emit("receive_render_tasks");
    io.emit("receive_render_activity");
    io.emit("receive_render_calendar")
  });


  //Chat controllers
  socket.once("join_chat", (chatId) => {
    socket.join(chatId); //creates a socket room with chatId and adds the user to it
    console.log(`user: ${user.name} entering room: ${chatId}`);
  });

  socket.on("send_message", async (messageObj) => {
    const fullMessage = { ...messageObj, sender: user };

    await Message.create(fullMessage);
    //Sends changes to all sockets users
    socket.to(fullMessage.chatId).emit("receive_message", fullMessage); //sends the message to all socket room users except the sender
    io.emit("receive_alert_message");

    socket.emit("receive_message", fullMessage); //sends the message to the sender
  });
});
