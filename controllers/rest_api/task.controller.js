const Task = require("../../models/Card.model");
const mongoose = require("mongoose");

module.exports = {
  getAllTasks: (req, res) => {
    Task.find()
      .then((allTasks) => {
        res.status(200).json(allTasks);
      })
      .catch((err) => res.status(400).json(err));
  },

  postNewTask: (req, res) => {
    const projectId = req.params.projectId;
    const { title, description, color, stat, limitDate } = req.body;

    Task.create({
      title: title,
      description: description,
      stat: stat,
      project: projectId,
      color: color,
      limitDate: limitDate,
    })
      .then((newTask) => {
        res.status(200).json(newTask);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteTask: (req, res) => {
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }
    Task.findByIdAndRemove(taskId)
      .then(() =>
        res.json({
          message: `Project with ${projectId} is removed successfully.`,
        })
      )
      .catch((error) => res.json(error));
  },

  putTaskState: (req, res) => {
    Task.findByIdAndUpdate(req.params.id, {
      stat: req.params.state.toUpperCase(),
    })
      .then((TaskUpdated) => {
        res.status(200).json(TaskUpdated);
      })
      .catch((err) => res.json(err));
  },

  getTask: (req, res) => {
    const taskId = req.params.id;
    Task.findById(taskId)
      .then((taskResponse) => {
        res.status(200).json(taskResponse);
      })
      .catch((error) => res.json(error));
  },

  putTask: (req, res) => {
    const { title, description, color, limitDate } = req.body;

    Task.findByIdAndUpdate(req.params.id, {
      title: title,
      description: description,
      color: color,
      limitDate: limitDate,
    })
      .then((TaskUpdated) => {
        res.json(TaskUpdated);
      })
      .catch((err) => res.json(err));
  },
};
