const User = require("../../models/User.model");

module.exports = {
  getUsers: (req, res) => {
    User.find()
      .then((allUsers) => res.status(200).json(allUsers))
      .catch((err) => res.json(err));
  },
  putUser: (req, res) => {
    User.findByIdAndUpdate(req.body._id, req.body, { new: true })
      .then((updatedUser) => res.status(200).json(updatedUser))
      .catch((err) => {
        if (err.code === 11000) {
          res.status(400).json({ message: "Duplicated user name." });
          return;
        }
        res.status(400).json(err);
      });
  },
};
