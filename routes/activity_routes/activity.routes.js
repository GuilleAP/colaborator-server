const router = require("express").Router();
const Activity = require("../../models/Activity.model");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  console.log(
    "🚀 ~ file: activity.routes.js ~ line 7 ~ router.get ~ req.query",
    req.query.currentProjects
  );

  Activity.find({ project: { $in: req.query.currentProjects } })
    .populate("project")
    .populate("user")
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => res.json(error));
});

router.post("/", (req, res, next) => {
  const { title, project, user } = req.body;

  Activity.create({ title, project, user })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => res.json(err));
});

module.exports = router;
