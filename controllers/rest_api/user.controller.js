const User = require("../../models/User.model");

module.exports = {
  getUsers: (req, res) => {
    User.find()
      .then((allUsers) => res.status(200).json(allUsers))
      .catch((err) => res.json(err));
  },
};
