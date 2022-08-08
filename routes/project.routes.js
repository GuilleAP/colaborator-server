const router = require("express").Router();
const projectController = require("../controllers/project.controller");

router.get("/", projectController.getAllProjects);
//  POST /api/projects  -  Creates a new project
router.post("/", projectController.postNewProject);
router.get("/:projectId/team", projectController.getProjectTeam);
router.get("/:userId/current", projectController.getCurrentProjectsByUser)
router.get("/:userId/current/id", projectController.getCurrentProjectByUser)
router.get("/:userId/completed", projectController.getCompletedProjectsByUser)
router.get("/:projectId", projectController.getProject)
// PUT  /api/projects/:projectId  -  Updates a specific project by id
router.put("/:projectId", projectController.putProject)
// DELETE  /api/projects/:projectId  -  Deletes a specific project by id
router.delete("/:projectId", projectController.deleteProject)

module.exports = router;
