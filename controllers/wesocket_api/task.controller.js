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
    })
    .catch((err) => {
      if (err.code === 11000) {
        socket.emit("errorMessage", "Duplicated task name");
      }
    });
};

const updateTask = (socket, io, taskBody) => {
  if (taskBody.title === "" || !taskBody.limitDate) {
    socket.emit("errorMessage", "Please provide a name and a team");
    return;
  }
  Task.findByIdAndUpdate(taskBody.taskId, taskBody, {
    new: true,
  })
    .then((updatedTask) => {
      console.log(
        "🚀 ~ file: task.controller.js ~ line 53 ~ .then ~ updatedTask",
        updatedTask
      );
      io.to(updatedTask.project.toString()).emit("taskUpdated", updatedTask);
    })
    .catch((err) => {
      if (err.code === 11000) {
        socket.emit("errorMessage", "Duplicated task name");
      }
    });
};

const deleteTask = (io, taskId, projectId) => {

    Task.findByIdAndRemove(taskId)
      .then(() => {
        io.to(projectId.toString()).emit("taskDeleted", taskId);
      })
      .catch((error) => res.json(error));
  };

module.exports = {
  getTasksByProject,
  newTask,
  updateTask,
  deleteTask
};
