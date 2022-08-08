const router = require("express").Router();
const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");
const mongoose = require("mongoose");

router.post("/start/direct-chat/:userId", (req, res, next) => {
  const { _id } = req.payload; //User 1
  const { userId } = req.params; //User 2
  //Check if chat between the users already exist
  Chat.findOne({ participants: { $all: [_id, userId] } })
    .then((foundChat) => {
      if (foundChat) {
        res.status(200).json(foundChat);
      } else {
        Chat.create({ participants: [_id, userId] }).then((newChat) => {
          res.status(200).json(newChat);
        });
      }
    })
    .catch((error) => res.json(error));
});

router.post("/start/project-chat/:projectId", (req, res, next) => {
  const { projectId } = req.params;
  //Check if chat between the users already exist
  Chat.findOne({ participants: projectId })
    .then((foundChat) => {
      if (foundChat) {
        res.status(200).json(foundChat);
      } else {
        Chat.create({ participants: projectId }).then((newChat) => {
          res.status(200).json(newChat);
        });
      }
    })
    .catch((error) => res.json(error));
});

router.post("/start/:userId", (req, res, next) => {
  const { _id } = req.payload; //User 1
  const { userId } = req.params; //User 2
  //Check if chat between the users already exist
  Chat.findOne({ participants: { $all: [_id, userId] } })
    .then((foundChat) => {
      if (foundChat) {
        res.status(200).json(foundChat);
      } else {
        Chat.create({ participants: [_id, userId] }).then((newChat) => {
          res.status(200).json(newChat);
        });
      }
    })
    .catch((error) => res.json(error));
});

router.get("/messages/:chatId", (req, res, next) => {
  const { chatId } = req.params;
  Message.find({ chatId })
    .populate("sender")
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => res.json(error));
});
module.exports = router;
