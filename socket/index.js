const socketioJwt = require("socketio-jwt");
const Message = require("../models/Message.model");
const {
  joinAllProjectsRoom,
  newProject,
  getCurrentProjectsByUser,
  joinProjectRoom
} = require("../controllers/wesocket_api/project.controller");

let usersSocket = [];

module.exports = (io) => {
  //token auth
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
    const count = io.engine.clientsCount;
    console.log(
      "🚀 ~ file: server.js ~ line 41 ~ io.on ~ Number of clients connected:",
      count
    );

    //Store user and it's socket
    let userSocketInfo = new Object();
    userSocketInfo.userId = user._id;
    userSocketInfo.socketId = socket.id;
    usersSocket.push(userSocketInfo);

    socket.on("getCurrentProjects", () => getCurrentProjectsByUser(socket, user));
    socket.on("joinAllProjectsRoom", () => joinAllProjectsRoom(socket, user));
    socket.on("joinProjectRoom", (roomId) => joinProjectRoom(socket, roomId, user));

    socket.on("newProject", (projectBody) =>
      newProject(socket, io, projectBody, user, usersSocket)
    );

    socket.on("socket_dcn", () => {
      console.log("Socket disconnected");
      socket.disconnect(true);
    });

    //Projects controller
    socket.on("render_projects", () => {
      io.emit("receive_render_projects");
      io.emit("receive_render_activity");
    });

    //Tasks controllers
    socket.on("render_tasks", () => {
      io.emit("receive_render_tasks");
      io.emit("receive_render_activity");
      io.emit("receive_render_calendar");
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
};
