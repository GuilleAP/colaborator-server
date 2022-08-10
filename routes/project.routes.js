const router = require("express").Router();
const projectController = require("../controllers/rest_api/project.controller");

// GET /colaborator-API/projects/ - Gets all the projects
router.get("/", projectController.getAllProjects);
// POST /colaborator-API/projects -  Creates a new project
router.post("/", projectController.postNewProject);
// GET /colaborator-API/projects/:projectId/team -  Gets the project's team
router.get("/:projectId/team", projectController.getProjectTeam);
// GET /colaborator-API/projects/:userId/current -  Gets the active user's projects
router.get("/:userId/current", projectController.getCurrentProjectsByUser)
// GET /colaborator-API/projects/:userId/current -  Gets the active user's projects id's
router.get("/:userId/current/id", projectController.getCurrentProjectsIdByUser)
// GET /colaborator-API/projects/:userId/current -  Gets the completed user's projects
router.get("/:userId/completed", projectController.getCompletedProjectsByUser)
// GET /colaborator-API/projects/:userId/current -  Gets an specific project by id
router.get("/:projectId", projectController.getProject)
// PUT  /colaborator-API/projects/:projectId  -  Updates a specific project by id
router.put("/:projectId", projectController.putProject)
// DELETE  /colaborator-API/projects/:projectId  -  Deletes a specific project by id
router.delete("/:projectId", projectController.deleteProject)

module.exports = router;
