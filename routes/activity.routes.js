const router = require("express").Router();
const mongoose = require("mongoose");
const activityController = require('../controllers/rest_api/activity.controller')

router.get("/", activityController.get)


router.post("/", activityController.post)

module.exports = router;
