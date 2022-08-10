const router = require("express").Router();
const Chat = require("../models/Chat.model");
const mongoose = require("mongoose");
const chatController = require("../controllers/rest_api/chat.controller");

router.post("/start/direct-chat/:userId", chatController.postDirectChat);

router.post("/start/project-chat/:projectId", chatController.postProjectChat);

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

router.get("/messages/:chatId", chatController.getChat);

module.exports = router;
