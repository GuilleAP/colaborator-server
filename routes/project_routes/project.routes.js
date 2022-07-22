const router = require("express").Router();
const Project = require("../../models/Project.model");
const Card = require("../../models/Card.model");
const mongoose = require('mongoose');

//  POST /api/projects  -  Creates a new project
router.post("/", (req, res, next) => {
  const { title, description, team, active, tech } = req.body;

  Project.create({ title, description, team, active, tech, cards: [] })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.get("/", (req, res, next) => {
  Project.find()
    .populate("cards")
    .populate("team")
    .then((allProjects) => res.json(allProjects))
    .catch((err) => res.json(err));
});

router.get("/current", (req, res, next) => {
  Project.find({active:true})
    .populate("cards")
    .populate("team")
    .then((allProjects) => res.json(allProjects))
    .catch((err) => res.json(err));
});

router.get("/completed", (req, res, next) => {
  Project.find({active:false})
    .populate("cards")
    .populate("team")
    .then((allProjects) => res.json(allProjects))
    .catch((err) => res.json(err));
});

router.get("/:projectId", (req, res, next) => {
  const { projectId } = req.params;
  console.log("🚀 ~ file: project.routes.js ~ line 24 ~ router.get ~ projectId", projectId)

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Each Project document has `cards` array holding `_id`s of Card documents
  // We use .populate() method to get swap the `_id`s for the actual Card documents
  Project.findById(projectId)
    .populate("cards")
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
    .then((updatedProject) => res.json(updatedProject))
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
      res.json({
        message: `Project with ${projectId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
