const router = require("express").Router();

const Project = require("../models/Project.model")
const User = require("../models/User.model")
const Task = require("../models/Card.model")
const Activity = require("../models/Activity.model")
const Chat = require("../models/Chat.model")
const Event = require("../models/Event.model")
const Message = require("../models/Message.model")

router.post('/reset', async(req, res) =>{
    await Project.deleteMany({})
    await User.deleteMany({})
    await Task.deleteMany({})
    await Activity.deleteMany({})
    await Chat.deleteMany({})
    await Event.deleteMany({})
    await Message.deleteMany({})
    res.status(204).end()
})

module.exports = router;
