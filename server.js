const app = require("./app");
const Project = require("./models/Project.model");
const Card = require("./models/Card.model");

// const Project = require("../../models/Project.model");
// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 5005;

const myServer = app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});

const { Server } = require("socket.io");


//cors
const io = new Server(myServer, {

  cors: {
    // origin: process.env.ORIGIN || "http://localhost:3000",
    origin: "*",

  },
});

require("./socket")(io);