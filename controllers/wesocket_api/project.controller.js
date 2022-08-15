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
      // socket.emit('newProjectCreated', project)
      project.team.map((member) => {
        totalUserSocket.map((user) => {
          if (member == user.userId) {
            io.to(user.socketId).emit("newProjectCreated", project);
          }
        });
      });
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

const updateProject = (socket, io, projectBody) => {
  // if (!mongoose.Types.ObjectId.isValid(projectId)) {
  //   res.status(400).json({ message: "Specified id is not valid" });
  //   return;
  // }

  Project.findByIdAndUpdate(projectBody.projectId, projectBody.team, { new: true })
    .populate("team")
    .then((updatedProject) => {
      socket.to(updatedProject._id).emit("projectUpdated", updatedProject);//sends the message to all socket room users except the sender
      socket.emit("projectUpdated", updatedProject);
      // io.sockets.in(updatedProject._id).emit("projectUpdated", updatedProject);
    })
    .catch((error) => res.json(error));
};

const deleteProject = (io, user) => {
  const { projectId } = req.params;

  // if (!mongoose.Types.ObjectId.isValid(projectId)) {
  //   res.status(400).json({ message: "Specified id is not valid" });
  //   return;
  // }

  Project.findByIdAndRemove(projectId)
    .then(() => io.in("projectId").emit("projectDeleted"))
    .catch((error) => res.json(error));
};

module.exports = {
  getCurrentProjectsByUser,
  newProject,
  joinProjectRoom,
  joinAllProjectsRoom,
  updateProject
};
