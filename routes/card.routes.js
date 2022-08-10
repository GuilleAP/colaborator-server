const router = require("express").Router();
const mongoose = require("mongoose");
const TaskController = require("../controllers/rest_api/task.controller");


/**
 * Ruta para recuperar todas las targetas de un proyecto
 */
router.get("/card/get-cards", TaskController.getAllTasks);

/**
 * Ruta para crear una nueva targeta dentro de un proyecto
 */
router.post("/:projectId/card/new-card", TaskController.postNewTask);

router.put("/card/updateCard/:id/:state", TaskController.putTaskState);

router.delete("/card/delete/:id", TaskController.deleteTask);

router.get("/card/edit/:id", TaskController.getTask);

router.put("/card/updateCard/:id", TaskController.putTask);

module.exports = router;
