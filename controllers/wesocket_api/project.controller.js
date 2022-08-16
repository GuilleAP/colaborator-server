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
      project.team.forEach((member) => {
        if (totalUserSocket.hasOwnProperty(member._id)) {
          io.to(totalUserSocket[member._id]).emit("newProjectCreated", project);
        }
      });
    })

    .catch((err) => console.log(err));
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

const updateProject = (io, projectBody, totalUserSocket) => {
  // if (!mongoose.Types.ObjectId.isValid(projectId)) {
  //   res.status(400).json({ message: "Specified id is not valid" });
  //   return;
  // }

  Project.findByIdAndUpdate(projectBody.projectId, projectBody, {
    new: true,
  })
    .populate("team")
    .then((updatedProject) => {
      console.log(
        "🚀 ~ file: project.controller.js ~ line 73 ~ .then ~ updatedProject",
        updatedProject
      );
      updatedProject.team.forEach((member) => {
        if (totalUserSocket.hasOwnProperty(member._id)) {
          io.to(totalUserSocket[member._id]).emit(
            "newProjectCreated",
            updatedProject
          );
        }
      });

      // io.to(updatedProject._id.toString()).emit(
      //   "projectUpdated",
      //   updatedProject
      // );
    })
    .catch((err) => console.log(err));
};

const deleteProject = (io, projectId, totalUserSocket) => {
  // if (!mongoose.Types.ObjectId.isValid(projectId)) {
  //   res.status(400).json({ message: "Specified id is not valid" });
  //   return;
  // }

  Project.findByIdAndRemove(projectId)
    .then((deletedProject) => {
      deletedProject.team.forEach((member) => {
        if (totalUserSocket.hasOwnProperty(member._id)) {
          io.to(totalUserSocket[member._id]).emit(
            "projectDeleted",
            deletedProject
          );
        }
      });
      // console.log("🚀 ~ file: project.controller.js ~ line 104 ~ .then ~ response", response)
      // io.to(projectId).emit("projectDeleted", projectId);
    })
    .catch((err) => console.log(err));
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
