const router = require("express").Router();
const User = require("../../models/User.model");
const Card = require("../../models/Card.model");
const mongoose = require('mongoose');


router.get("/", (req, res, next) => {

    User.find()
      .then((allUsers) => res.status(200).json(allUsers))
      .catch((err) => res.json(err));
  });

module.exports = router;
