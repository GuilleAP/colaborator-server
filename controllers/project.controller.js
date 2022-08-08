const Project = require("../models/Project.model");
const mongoose = require("mongoose");

module.exports = {
  getAllProjects: (req, res) => {
    Project.find()
      .populate("cards")
      .populate("team")
      .then((allProjects) => res.status(200).json(allProjects))
      .catch((err) => res.json(err));
  },

  postNewProject: (req, res) => {
    const { title, description, admin, team, active, tech } = req.body;
    Project.create({ title, description, admin, team, active, tech, cards: [] })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => res.json(err));
  },

  getProjectTeam: (req, res) => {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }
    Project.findById(projectId)
      .populate("cards")
      .populate("team")
      .then((project) => res.status(200).json(project.team))
      .catch((error) => res.json(error));
  },

  getCurrentProjectsByUser: (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Project.find({ active: true, team: userId })
      .populate("cards")
      .populate("team")
      .then((allProjects) => res.status(200).json(allProjects))
      .catch((err) => res.json(err));
  },

  getCurrentProjectByUser: (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Project.find({ active: true, team: userId })
      .select("_id")
      .then((allProjectsId) => res.status(200).json(allProjectsId))
      .catch((err) => res.json(err));
  },

  getCompletedProjectsByUser: (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Project.find({ active: false, team: userId })
      .populate("cards")
      .populate("team")
      .then((allProjects) => res.status(200).json(allProjects))
      .catch((err) => res.json(err));
  },

  getProject: (req, res) => {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    // Each Project document has `cards` array holding `_id`s of Card documents
    // We use .populate() method to get swap the `_id`s for the actual Card documents
    Project.findById(projectId)
      .populate("cards")
      .populate("team")
      .then((project) => res.status(200).json(project))
      .catch((error) => res.json(error));
  },

  putProject: (req, res) => {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Project.findByIdAndUpdate(projectId, req.body, { new: true })
      .then((updatedProject) => res.status(200).json(updatedProject))
      .catch((error) => res.json(error));
  },

  deleteProject: (req, res) => {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Project.findByIdAndRemove(projectId)
      .then(() =>
        res.status(200).json({
          message: `Project with ${projectId} is removed successfully.`,
        })
      )
      .catch((error) => res.json(error));
  },
};
