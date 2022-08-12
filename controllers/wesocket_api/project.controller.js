const Project = require("../../models/Project.model");
const mongoose = require("mongoose");

  const getCurrentProjectsByUser = (socket, userId) => {
    Project.find({ active: true, team: userId })
      .populate("cards")
      .populate("team")
      .then((allProjects) => {
        socket.emit('fetchCurrentProjects', allProjects)
        return allProjects;
      })
      .catch((err) =>{
        socket.emit('fetchCurrentProjectsError', err)
      }) 
  }

  const newProject = (socket, project, user) => {

    const { title, description, admin, team, active, tech } = project;
    console.log("🚀 ~ file: project.controller.js ~ line 16 ~ team", team);
    // if (title === "" || !team.length) {
    //   res.status(400).json({ message: "Provide a project title and a team" });
    //   return;
    // }
    Project.create({ title, description, admin, team, active, tech, cards: [] })
    .then((project) => {
      socket.emit('newProjectCreated', project)
      joinRoom(project._id, user)

    })

      .catch((err) => console.log(err));
  }

  const joinProjectRoom = (roomId, user) => {
    socket.join(roomId); //creates a socket room with chatId and adds the user to it
    console.log(`user: ${user.name} entering room: ${project._id}`);
  }

  const joinAllProjectsRoom = (socket, user) => {
      Project.find({ active: true, team: userId })
        .select("_id")
        .then((allProjectsId) =>{
          allProjectsId.map((project)=>{
            joinProjectRoom(project._id, user);
          })
        })
        .catch((err) => res.json(err));


  }

  module.exports =  {
    newProject,
    joinProjectRoom,
    joinAllProjectsRoom
  }
