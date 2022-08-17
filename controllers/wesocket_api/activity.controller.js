const Activity = require("../../models/Activity.model");

const getActivities = (socket, projectsIds) => {
  Activity.find({ project: { $in: projectsIds } })
    .populate("project")
    .populate("user")
    .then((allActivities) => {
      socket.emit("getActivities", allActivities);
    })
    .catch((error) => res.json(error));
};

const newActivity = (io, activityBody) => {
console.log("🚀 ~ file: activity.controller.js ~ line 14 ~ newActivity ~ activityBody", activityBody)
  const { title, project, user } = activityBody;
  Activity.create({ title, project, user })
    .then((newActivity) => {
      io.to(project.toString()).emit("newActivityCreated", newActivity);
    })
    .catch((err) => console.log(err));
};

module.exports = {
  newActivity,
  getActivities
};
