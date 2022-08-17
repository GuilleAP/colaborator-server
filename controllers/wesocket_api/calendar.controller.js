const Task = require("../../models/Card.model");

const getEvents = (socket, projectId) => {
  Task.find({ project: projectId })
    .then((allTasks) => {
      let events = [];
      allTasks.forEach((task) => {
        let startDate = task.limitDate + "T07:00:00";
        let endDate = task.limitDate + "T08:00:00";
        let eventObject = {
          id: task._id,
          title: task.title,
          start: startDate,
          end: endDate,
          color: task.color,
        };

        events.push(eventObject);
      });
      socket.emit("getEvents", events);
    })
    .catch((err) => {
      socket.emit("getEvents", err);
    });
};

module.exports= {
    getEvents
}
