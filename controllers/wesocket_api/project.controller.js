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

const newProject = (socket, io, projectBody, user, usersSocket) => {
  const { title, description, admin, team, active, tech } = projectBody;
  console.log(
    "🚀 ~ file: project.controller.js ~ line 20 ~ newProject ~ title",
    title
  );
  // if (title === "" || !team.length) {
  //   res.status(400).json({ message: "Provide a project title and a team" });
  //   return;
  // }
  Project.create({ title, description, admin, team, active, tech, cards: [] })
    .then((project) => {
      // socket.emit('newProjectCreated', project)
      project.team.map((member) => {
        usersSocket.map((user) => {
          if (member == user.userId) {
            io.to(user.socketId).emit("newProjectCreated", project);
          }
        });
      });
      // joinProjectRoom(socket, project._id, user)
      // getCurrentProjectsByUser(socket, user._id)
    })

    .catch((err) => console.log(err));
};

const joinProjectRoom = (socket, roomId, user) => {
  socket.join(roomId); //creates a socket room with chatId and adds the user to it
  console.log(`user: ${user.name} entering room: ${roomId}`);
};

const joinAllProjectsRoom = (socket, user) => {
  Project.find({ active: true, team: user._id })
    .select("_id")
    .then((allProjectsId) => {
      allProjectsId.map((project) => {
        joinProjectRoom(socket, project._id, user);
      });
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getCurrentProjectsByUser,
  newProject,
  joinProjectRoom,
  joinAllProjectsRoom,
};
