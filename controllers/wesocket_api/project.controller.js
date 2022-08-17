const Project = require("../../models/Project.model");
const mongoose = require("mongoose");

const getCurrentProjectsByUser = (socket, userId) => {
  Project.find({ active: true, team: userId })
    .populate("cards")
    .populate("team")
    .then((allCurrentProjects) => {
      socket.emit("getCurrentProjects", allCurrentProjects);
    })
    .catch((err) => {
      socket.emit("getCurrentProjects", err);
    });
};

const newProject = (socket, io, projectBody, user, totalUserSocket) => {
  const { title, description, admin, team, active, tech } = projectBody;
  if (title === "" || !team.length) {
    socket.emit("errorMessage", "Please provide a name and a team");
    return;
  }
  Project.create({ title, description, admin, team, active, tech, cards: [] })
    .then((project) => {
      // socket.emit('newProjectCreated', project)
      project.team.forEach((member) => {
        if (totalUserSocket.hasOwnProperty(member._id)) {
          console.log("MEMBER: ", member._id, " IS CONNECTED");
          io.to(totalUserSocket[member._id]).emit("newProjectCreated", project);
        } else {
          console.log("MEMBER: ", member._id, " IS NOT CONNECTED");
        }
      });
      // project.team.map((member) => {
      //   totalUserSocket.map((user) => {
      //     if (member == user.userId) {
      //       io.to(user.socketId).emit("newProjectCreated", project);
      //     }
      //   });
      // });
    })
    .catch((err) => {
      if (err.code === 11000) {
        socket.emit("errorMessage", "Duplicated project name");
      }
    });
};

const joinProjectRoom = (socket, io, roomId, user) => {
  socket.join(roomId); //creates a socket room with chatId and adds the user to it
  console.log(`user: ${user.name} entering room: ${roomId}`);
  // const clients = io.sockets.adapter.rooms.get(roomId);
  // const numClients = clients ? clients.size : 0;

  console.log(
    "🚀 ~ file: project.controller.js ~ line 76 ~ .then ~ clients",
    io.sockets.adapter.rooms
  );
};

const joinAllProjectsRoom = (socket, io, user) => {
  Project.find({ active: true, team: user._id })
    .select("_id")
    .then((allProjectsId) => {
      allProjectsId.forEach((projectId) => {
        joinProjectRoom(socket, io, projectId._id.toString(), user);
      });
    })
    .catch((err) => console.log(err));
};

const updateProject = (socket, io, projectBody) => {
  // if (!mongoose.Types.ObjectId.isValid(projectId)) {
  //   res.status(400).json({ message: "Specified id is not valid" });
  //   return;
  // }
  if (projectBody.title === "" || !projectBody.team.length) {
    socket.emit("errorMessage", "Please provide a name and a team");
    return;
  }
  Project.findByIdAndUpdate(projectBody.projectId, projectBody, {
    new: true,
  })
    .populate("team")
    .then((updatedProject) => {
      io.to(updatedProject._id.toString()).emit(
        "projectUpdated",
        updatedProject
      ); //sends the message to all socket room users except the sender
      // socket.emit("projectUpdated", updatedProject);
      // io.sockets.in(updatedProject._id).emit("projectUpdated", updatedProject);
    })
    .catch((err) => {
      if (err.code === 11000) {
        socket.emit("errorMessage", "Duplicated project name");
      }
    });
};

const deleteProject = (io, projectId) => {
  // if (!mongoose.Types.ObjectId.isValid(projectId)) {
  //   res.status(400).json({ message: "Specified id is not valid" });
  //   return;
  // }

  Project.findByIdAndRemove(projectId);
  console.log(
    "🚀 ~ file: project.controller.js ~ line 100 ~ deleteProject ~ projectId",
    projectId
  );
  Project.findByIdAndRemove(projectId)
    .then(() => {
      io.to(projectId).emit("projectDeleted", projectId);
    })
    .catch((error) => res.json(error));
};

const leaveProjectRoom = (socket, io, roomId, user) => {
  socket.leave(roomId); //creates a socket room with chatId and adds the user to it
  console.log(`user: ${user.name} leaving room: ${roomId}`);
  // const clients = io.sockets.adapter.rooms.get(roomId);
  // const numClients = clients ? clients.size : 0;
};

module.exports = {
  getCurrentProjectsByUser,
  newProject,
  joinProjectRoom,
  joinAllProjectsRoom,
  updateProject,
  leaveProjectRoom,
  deleteProject,
};
