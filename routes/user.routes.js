const router = require("express").Router();
const userController = require("../controllers/rest_api/user.controller");

router.get("/", userController.getUsers);

module.exports = router;
