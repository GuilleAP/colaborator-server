const socketioJwt = require("socketio-jwt");
const Message = require("../models/Message.model");
const {
  joinAllProjectsRoom,
  newProject,
  getCurrentProjectsByUser,
  joinProjectRoom,
  leaveProjectRoom,
  updateProject,
  deleteProject,
} = require("../controllers/wesocket_api/project.controller");

const {
  getTasksByProject,
  newTask,
  updateTask,
  updateTaskState,
  deleteTask,
} = require("../controllers/wesocket_api/task.controller");

const {
  getActivities,
  newActivity,
} = require("../controllers/wesocket_api/activity.controller");

const {
  getEvents,
} = require("../controllers/wesocket_api/calendar.controller");
let totalUserSocket = {};

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
    totalUserSocket[user._id] = socket.id;
    // let userSocketInfo = new Object();
    // userSocketInfo.userId = user._id;
    // userSocketInfo.socketId = socket.id;
    // totalUserSocket.push(userSocketInfo);

    //Project events listeners
    socket.on("getCurrentProjects", () =>
      getCurrentProjectsByUser(socket, user._id)
    );
    socket.on("joinAllProjectsRoom", () =>
      joinAllProjectsRoom(socket, io, user)
    );
    socket.on("joinProjectRoom", (roomId) =>
      joinProjectRoom(socket, io, roomId, user)
    );
    socket.on("leaveProjectRoom", (roomId) =>
      leaveProjectRoom(socket, io, roomId, user)
    );
    socket.on("deleteProject", (projectId) => deleteProject(io, projectId));
    socket.on("updateProject", (projectBody) =>
      updateProject(socket, io, projectBody)
    );
    socket.on("newProject", (projectBody) =>
      newProject(socket, io, projectBody, user, totalUserSocket)
    );

    //Task events listeners
    socket.on("getTasksByProject", (projectId) =>
      getTasksByProject(socket, projectId)
    );
    socket.on("newTask", (taskBody) => newTask(socket, io, taskBody));
    socket.on("updateTask", (taskBody) => updateTask(socket, io, taskBody));
    socket.on("deleteTask", (taskId, projectId) =>
      deleteTask(io, taskId, projectId)
    );
    socket.on("updateTaskState", (taskBody) =>
      updateTaskState(socket, io, taskBody)
    );

    //Activity events listeners
    socket.on("getActivities", (projectIds) =>
      getActivities(socket, projectIds)
    );
    getActivities;
    socket.on("newActivity", (activityBody) => newActivity(io, activityBody));

    //Calendar events listeners
    socket.on("getEvents", (projectId) => getEvents(socket, projectId));

    socket.on("socket_dcn", () => {
      console.log("Socket disconnected");
      delete totalUserSocket[user._id];
      socket.disconnect(true);
    });

    //Chat controllers
    socket.once("join_chat", (chatId) => {
      socket.join(chatId); //creates a socket room with chatId and adds the user to it
      console.log(`user: ${user.name} entering room: ${chatId}`);
    });

    socket.on("send_message", async (messageObj) => {
      const fullMessage = { ...messageObj.messageObj, sender: user };

      console.log("🚀 ~ file: index.js ~ line 146 ~ socket.on ~ messageObj", messageObj)
      await Message.create(fullMessage);

      if (messageObj.isProjectChat) {
        //If is a project chat, sends the message to all project room

        socket
          .to(messageObj.messageObj.room.toString())
          .emit("receive_message", fullMessage);
        socket
          .to(messageObj.messageObj.room.toString())
          .emit("receive_alert_message", {fullMessage:fullMessage, isProjectChat: true});
        socket.emit("receive_message", fullMessage); //sends the message to the sender

        return;
      }

      //If its a direct chat, sends the message to the user (privat event) and to the sender

      io.to(totalUserSocket[messageObj.messageObj.room]).emit(
        "receive_message",
        fullMessage
      );
      io.to(totalUserSocket[messageObj.messageObj.room]).emit(
        "receive_alert_message",
        {fullMessage:fullMessage, isProjectChat:false}
      );
      socket.emit("receive_message", fullMessage); //sends the message to the sender
    });
  });
};
