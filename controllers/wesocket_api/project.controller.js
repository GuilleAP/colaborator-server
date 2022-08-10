const Project = require("../../models/Project.model");
const mongoose = require("mongoose");

  const getCurrentProjectsByUser = (socket, userId) => {
    Project.find({ active: true, team: userId })
      .populate("cards")
      .populate("team")
      .then((allProjects) => {
        socket.emit('fetchCurrentProjects', allProjects)
      })
      .catch((err) =>{
        socket.emit('fetchCurrentProjectsError', err)
      }) 
  }


