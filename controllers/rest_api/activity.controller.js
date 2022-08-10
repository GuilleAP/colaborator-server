const Activity = require("../../models/Activity.model");

module.exports = {
  get: (req, res) => {
    Activity.find({ project: { $in: req.query.currentProjects } })
      .populate("project")
      .populate("user")
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((error) => res.json(error));
  },

  post: (req, res) => {
    const { title, project, user } = req.body;
    Activity.create({ title, project, user })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => res.json(err));
  },
};
