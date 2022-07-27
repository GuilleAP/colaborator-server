const router = require("express").Router();
const Project = require("../../models/Project.model");
const User = require("../../models/User.model");

const Card = require("../../models/Card.model");
const mongoose = require("mongoose");

//  POST /api/projects  -  Creates a new project
router.post("/", (req, res, next) => {
  const { title, description, admin, team, active, tech } = req.body;

  Project.create({ title, description, admin, team, active, tech, cards: [] })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => res.json(err));
  // User.findBy({_id:{$in: team}})
});

router.get("/", (req, res, next) => {
  Project.find()
    .populate("cards")
    .populate("team")
    .then((allProjects) => res.status(200).json(allProjects))
    .catch((err) => res.json(err));
});

router.get("/:projectId/team", (req, res, next) => {
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
    .then((project) => res.status(200).json(project.team))
    .catch((error) => res.json(error));
});

router.get("/:userId/current", (req, res, next) => {
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
});


router.get("/:userId/current/id", (req, res, next) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.find({ active: true, team: userId })
    .select('_id')
    .then((allProjectsId) => res.status(200).json(allProjectsId))
    .catch((err) => res.json(err));
});

router.get("/:userId/completed", (req, res, next) => {
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
});

router.get("/:projectId", (req, res, next) => {
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
});

// PUT  /api/projects/:projectId  -  Updates a specific project by id
router.put("/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndUpdate(projectId, req.body, { new: true })
    .then((updatedProject) => res.status(200).json(updatedProject))
    .catch((error) => res.json(error));
});

// DELETE  /api/projects/:projectId  -  Deletes a specific project by id
router.delete("/:projectId", (req, res, next) => {
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
});

module.exports = router;
