const Task = require("../../models/Card.model");
const mongoose = require("mongoose");

const getTasksByProject = (socket, projectId) => {
    
  Task.find({ project: projectId })
    .then((allTasks) => {
      socket.emit("getTasksByProject", allTasks);
    })
    .catch((err) => {
      socket.emit("getTasksByProject", err);
    });
};



const newTask = (socket, io, taskBody) => {
  const { title, description, color, stat, project, limitDate } = taskBody;

  if (title === "" || !limitDate) {
    socket.emit("errorMessage", "Please provide a title and a limit date");
    return;
  }
  Task.create({
    title,
    description,
    stat,
    color,
    limitDate,
    project,

  })
    .then((task) => {
      io.to(project.toString()).emit("newTaskCreated", task);
      console.log("🚀 ~ file: task.controller.js ~ line 35 ~ .then ~ project", project)
    })
    .catch((err) => {
      if (err.code === 11000) {
        socket.emit("errorMessage", "Duplicated task name");
      }
    });
};

module.exports = {
  getTasksByProject,
  newTask
};
