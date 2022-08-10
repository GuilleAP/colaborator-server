const Chat = require("../../models/Chat.model");
const Message = require("../../models/Message.model");

module.exports = {
  getChat: (req, res) => {
    const { chatId } = req.params;
    Message.find({ chatId })
      .populate("sender")
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((error) => res.json(error));
  },

  postDirectChat: (req, res) => {
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
  },

  postProjectChat: (req, res) => {
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
  },
};
